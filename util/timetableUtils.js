import { useWindowDimensions } from "react-native";
import { deleteLecturesBetweenDates, insertCourse, insertExecutionType, insertGroup, insertLecture, insertLecturer, insertRoom } from "./database";
import { fetchGroupsForBranch, fetchLecturesForGroups } from "./http";
import { getAllUniqueGroups } from "./groupUtil";
import { getAllStoredBranchGroups, getSchoolInfo, setAllBranchGroups } from "../store/schoolInfo";

export async function getAndSetAllDistinctBranchGroups(schoolCode, chosenBranchID) {
  const groups = getAllUniqueGroups(await fetchGroupsForBranch(schoolCode, chosenBranchID))
  setAllBranchGroups(groups)
  return groups
}

export async function fetchAndInsertLectures(schoolCode, allGroups, startDate, endDate) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups, startDate, endDate)
  console.log("Number of lectures: " + allLectures.length)
  await allLectures.forEach(async ({rooms, groups, lecturers, executionTypeId, executionType, course, courseId}) => {
    // each will be inserted ONLY IF ITS UNIQUE
    if(course !== '')
      await insertCourse(Number(courseId), course)
    if(executionType !== '')
      await insertExecutionType(Number(executionTypeId), executionType)
    rooms.forEach(async room => { await insertRoom(Number(room.id), room.name)})
    groups.forEach(async group => { await insertGroup(Number(group.id), group.name).catch((error) => console.log(error))})
    lecturers.forEach(async lecturer => { await insertLecturer(Number(lecturer.id), lecturer.name)})
  });

  // now we add all lectures
  for (const lecture of allLectures){
    await insertLecture(lecture)
  }
}

export async function updateLectures(startDate, endDate) {
  const schoolInfo = await getSchoolInfo()
  const schoolCode = schoolInfo.schoolCode
  const allGroups = await getAllStoredBranchGroups()
  await deleteLecturesBetweenDates(startDate, endDate)
  return fetchAndInsertLectures(schoolCode, allGroups, startDate, endDate)
}

export function formatArray(array, key) {
  let string = ''
  for(let i = 0; i<array.length; i++)
    string += array[i][key] +((i !== array.length -1) ? ', ' : '')

  return string
}

export function getColumnWidth(isWeekView) { // https://github.com/dorkyboi/react-native-calendar-timetable?tab=readme-ov-file#layout
  const {width, height} = useWindowDimensions()
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