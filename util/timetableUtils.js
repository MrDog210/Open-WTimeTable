import { insertCourse, insertExecutionType, insertGroup, insertLecturer, insertRoom } from "./database";
import { fetchLecturesForGroups } from "./http";

export async function fillUpDatabase(schoolCode, allGroups) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups)

  allLectures.forEach(({rooms, groups, lecturers, executionTypeId, executionType, course, courseId}) => {
    // each will be inserted ONLY IF ITS UNIQUE
    //rooms.forEach(room => {insertRoom(room.id, room.name)})
    //groups.forEach(group => {await insertGroup(group.id, group.name)})
    //lecturers.forEach(lecturer => {insertLecturer(lecturer.id, lecturer.name)})
    //insertExecutionType(Number(executionTypeId), executionType)
    //insertCourse(Number(courseId), course)

    for (const group of groups) {
      insertGroup(group.id, group.name)
    }
  });

  // now we add all lectures
}