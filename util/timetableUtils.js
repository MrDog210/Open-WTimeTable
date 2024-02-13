import { insertCourse, insertExecutionType, insertGroup, insertLecture, insertLecturer, insertRoom } from "./database";
import { fetchLecturesForGroups } from "./http";

export async function fillUpDatabase(schoolCode, allGroups) { // allGroups should be an array of all available groups
  const allLectures = await fetchLecturesForGroups(schoolCode, allGroups)
  console.log("Number of lectures: " + allLectures.length)
  let i = 1;
  await allLectures.forEach(async ({rooms, groups, lecturers, executionTypeId, executionType, course, courseId}) => {
    // each will be inserted ONLY IF ITS UNIQUE
    await insertCourse(Number(courseId), course)
    await insertExecutionType(Number(executionTypeId), executionType)
    console.log(i++)
    rooms.forEach(async room => { await insertRoom(Number(room.id), room.name)})
    groups.forEach(async group => { await insertGroup(Number(group.id), group.name)})
    lecturers.forEach(async lecturer => { await insertLecturer(Number(lecturer.id), lecturer.name)})
  });

  // now we add all lectures
  /* allLectures.forEach(async lecture => {
    await insertLecture(lecture)
  }) */
}