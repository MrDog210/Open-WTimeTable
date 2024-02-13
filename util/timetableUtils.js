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