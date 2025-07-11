import { ScaledSize } from "react-native";
import { Course, ExecutionType, GroupBranchChild, GroupBranchMain, GroupLecture, Lecturer, Room } from "../types/types"
import { fetchGroupsForBranch, fetchLecturesForGroups, getSchoolInfo } from "./http/api"
import { hasInternetConnection } from "./http/http"
import { batchInsertGRLETC, deleteLecturesBetweenDates, getAllDistinctSelectedGroups, insertLecture } from "./store/database"
import { setAllBranchGroups, getSchoolInfo as getStoredSchoolInfo, getAllStoredBranchGroups, getUrlSchoolCode, setSchoolInfo } from "./store/schoolData"

export async function getAndSetAllDistinctBranchGroups(schoolCode: string, chosenBranchesID: string[]) {
  const groups: GroupBranchChild[] = []
  for (const branchId of chosenBranchesID)
    groups.push(...getAllUniqueGroups(await fetchGroupsForBranch(schoolCode, branchId)))
  await setAllBranchGroups(groups)
  return groups
}

function makeUniqueArray<T, K extends keyof T>(
  arr: T[],
  key: K
): T[] {
  const map = new Map<T[K], T>();
  for (const item of arr) {
    map.set(item[key], item); // keeps the last occurrence
  }
  return Array.from(map.values());
}

export async function fetchAndInsertLectures(schoolCode: string, allGroups: { id: number }[], startDate: Date, endDate: Date) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups, startDate, endDate)
  if(allLectures.length === 0) return
  await deleteLecturesBetweenDates(startDate, endDate)

  console.log("Number of lectures: " + allLectures.length)
  // TODO: make lazy insert where only insertLecture is being used
  const allRooms: Room[] = []
  const allGroupsFromFetch: GroupLecture[] = []
  const allLecturers: Lecturer[] = []
  const allExecutionTypes: ExecutionType[] = []
  const allCoures: Course[] = []

  allLectures.forEach(({ rooms, groups, lecturers, executionTypeId, executionType, course, courseId }) => {
    allRooms.push(...rooms)
    allGroupsFromFetch.push(...groups)
    allLecturers.push(...lecturers)
    allExecutionTypes.push({ id: Number(executionTypeId), executionType})
    allCoures.push({ id: Number(courseId), course})
  });

  const uniqueRooms = makeUniqueArray(allRooms, 'id')
  const uniqueGroups = makeUniqueArray(allGroupsFromFetch, 'id')
  const uniqueLecturers = makeUniqueArray(allLecturers, 'id')
  const uniqueExecutionTypes = makeUniqueArray(allExecutionTypes.filter(v => v.executionType !== ''), 'id')
  const uniqueCourses = makeUniqueArray(allCoures.filter(v => v.course !== ''), 'id')

  //console.log(uniqueRooms, uniqueExecutionTypes, uniqueGroups, uniqueLecturers, uniqueCourses)
  console.log("starting to insert side tables")
  await batchInsertGRLETC(uniqueRooms, uniqueGroups, uniqueLecturers, uniqueExecutionTypes, uniqueCourses)
  console.log("finished inserting side tables")


  // now we add all lectures
  const promises = []
  for (const lecture of allLectures)
    promises.push(insertLecture(lecture))

  return Promise.all(promises)
}

/*export async function fetchAndInsertLectures(
  schoolCode: string,
  allGroups: { id: number }[],
  startDate: Date,
  endDate: Date
) {
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups, startDate, endDate);
  await deleteLecturesBetweenDates(startDate, endDate);

  console.log("Number of lectures: " + allLectures.length);

  for (const { rooms, groups, lecturers, executionTypeId, executionType, course, courseId } of allLectures) {
    if (course !== '') await insertCourse(Number(courseId), course);
    if (executionType !== '') await insertExecutionType(Number(executionTypeId), executionType);

    for (const room of rooms) {
      await insertRoom(room.id, room.name).catch((error) => console.log("insertRoom error", error));
    }
    for (const group of groups) {
      await insertGroup(group.id, group.name).catch((error) => console.log("insertGroup error", error));
    }
    for (const lecturer of lecturers) {
      await insertLecturer(lecturer.id, lecturer.name).catch((error) => console.log("insertLecturer error", error));
    }
  }

  // Now insert all lectures in parallel (if they're independent)
  const promises = allLectures.map(lecture => insertLecture(lecture));
  return Promise.all(promises);
}*/

export async function updateLectures(startDate: Date, endDate: Date, fastRefresh = false) {
  const hasInternet = await hasInternetConnection()
  if(!hasInternet) return

  const schoolInfo = await getStoredSchoolInfo()
  const schoolCode = schoolInfo.schoolCode
  const allGroups = fastRefresh ? await getAllDistinctSelectedGroups() : (await getAllStoredBranchGroups()) as any as { id: number }[]
  
  return fetchAndInsertLectures(schoolCode, allGroups, startDate, endDate)
}

export function formatArray(array: { [key: string]: any }[], key: string) {
  let string = ''
  for(let i = 0; i<array.length; i++)
    string += array[i][key] +((i !== array.length -1) ? ', ' : '')

  return string
}

export function getColumnWidth({width, height}: ScaledSize, isWeekView: boolean) { // https://github.com/dorkyboi/react-native-calendar-timetable?tab=readme-ov-file#layout
  const timeWidth = 50
  const linesLeftInset = 15
  const columnWidth = width - (timeWidth - linesLeftInset)
  if(width>height && isWeekView) // if in landscape
    return Math.round(columnWidth/5)
  else 
    return Math.max(Math.round(columnWidth/5), 150)
}

export function calculateNowLineOffset(padding = 0,snapToHour = true) { // TODO: should make these global constants
  const d = new Date(); //'2020-02-02T09:00:00'
  const fromHour = 6, minuteHeight = 80 / 60, linesTopOffset = 18
  return (Math.max((d.getHours() - fromHour), 0) * 60 + (snapToHour ? 0 : d.getMinutes())) * minuteHeight + linesTopOffset + padding;
}

export async function hasTimetableUpdated() {
  const storedinfo = await getStoredSchoolInfo()
  const schoolInfo = await getSchoolInfo((await getUrlSchoolCode())!)
  const hasUpdated = storedinfo.lastChangeDate !== schoolInfo.lastChangeDate
  console.log('has updated: ' + hasUpdated)
  if(hasUpdated)
    setSchoolInfo(schoolInfo)
  return hasUpdated
}

export function getAllUniqueGroups(allGroups: GroupBranchMain[]) {
  const groups: GroupBranchChild[] = []

  allGroups.forEach(group => {
    const index = groups.findIndex((g) => g.id === Number(group.id))

    if (index === -1) // if there is no matching group already in our unique groups, we add this group
      groups.push({
        id: Number(group.id), 
        name: group.name
      })
  });

  return groups
}

export function getGroupsIntersection(groups1: GroupBranchChild[], groups2: GroupBranchChild[]) { // returns all the common groups between two arrays
  const commonGroups: GroupBranchChild[] = []
  console.log('g1', groups1)
  console.log('g2', groups2)

  groups1.forEach(g1 => {
    groups2.forEach(g2 => {
      if(g2.id === g1.id)
        commonGroups.push(g1)
    })
  })
  
  return commonGroups
}