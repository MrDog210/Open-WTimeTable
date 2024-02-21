import { useWindowDimensions } from "react-native";
import { insertCourse, insertExecutionType, insertGroup, insertLecture, insertLecturer, insertRoom } from "./database";
import { fetchLecturesForGroups } from "./http";

export async function fillUpDatabase(schoolCode, allGroups) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups)
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
  if(width>height && isWeekView)
    return Math.round(columnWidth/5)
  else 
    return columnWidth
}