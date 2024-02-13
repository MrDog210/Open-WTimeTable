import { insertCourse, insertExecutionType, insertGroup, insertLecture, insertLecturer, insertRoom } from "./database";
import { fetchLecturesForGroups } from "./http";

export async function fillUpDatabase(schoolCode, allGroups) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups)
  console.log("Number of lectures: " + allLectures.length)
  allLectures.forEach(({rooms, groups, lecturers, executionTypeId, executionType, course, courseId}) => {
    // each will be inserted ONLY IF ITS UNIQUE
    rooms.forEach(room => {insertRoom(Number(room.id), room.name)})
    groups.forEach(group => {insertGroup(Number(group.id), group.name)})
    lecturers.forEach(lecturer => {insertLecturer(Number(lecturer.id), lecturer.name)})
    insertExecutionType(Number(executionTypeId), executionType)
    insertCourse(Number(courseId), course)
  });

  // now we add all lectures
  allLectures.forEach(lecture => {
    insertLecture(lecture)
  })
}