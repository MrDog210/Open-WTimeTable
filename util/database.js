import * as SQLite from 'expo-sqlite';
import { CREATE_DATABASE, DELETE_COMMANDS } from '../constants/database';
import { getISODateNoTimestamp } from './dateUtils';

const database = SQLite.openDatabaseAsync('lectures.db')

export async function init() {
  const db = await database
  for (const sql of CREATE_DATABASE) {
    console.log('creating table')
    await db.execAsync(sql)
  }
}

export async function truncateDatabase() {
  const db = await database

  for(const sql of DELETE_COMMANDS) {
    await db.execAsync(sql)
  }
}

export async function insertGroup(id, name) {
  const db = await database
  return db.runAsync('INSERT OR IGNORE INTO groups (id, name) VALUES (?,?);', [id, name])
} 

export async function insertRoom(id, name) {
  const db = await database
  return db.runAsync('INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name])
}

export async function insertLecturer(id, name) {
  const db = await database
  return db.runAsync('INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name])
}

export async function insertExecutionType(id, executionType) {
  const db = await database
  return db.runAsync('INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType])
}

export async function insertCourse(id, course) {
  const db = await database
  return db.runAsync('INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course])
}

export async function insertLecturesHasGroups(lecturesId, groupsId) {
  const db = await database
  return db.runAsync('INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?, ?);', [lecturesId, groupsId])
}

export async function insertLecturesHasLecturers(lecturesId, lecturersId) {
  const db = await database
  return db.runAsync('INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lecturesId, lecturersId])
}

export async function insertLecturesHasRooms(lecturesId, roomsId) {
  const db = await database
  return db.runAsync('INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lecturesId, roomsId])
}

export async function truncateSelectedGroups() {
  const db = await database
  return db.execAsync('DELETE FROM selected_groups;')
}

export async function insertSelectedGroups(courses_id, groups_id) {
  const db = await database
  return db.runAsync('INSERT INTO selected_groups (courses_id, groups_id) VALUES (?,?);', [courses_id, groups_id])
}

export async function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}) {
  const db = await database
  
  const result = await db.runAsync('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
      [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId]) 

  //console.log('result: ' + resultSet.insertId)
  let lectureId = result.lastInsertRowId
  rooms.forEach(async room => { await insertLecturesHasRooms(lectureId, Number(room.id))})
  lecturers.forEach(async lecturer => { await insertLecturesHasLecturers(lectureId, Number(lecturer.id))})
  const promises = []
  for( const group of groups)
    promises.push(insertLecturesHasGroups(lectureId, Number(group.id)))

  return Promise.all(promises)
}

export async function getAllDistinctGroupsOfCourse(courseId) {
  const db = await database

  const result = await db.getAllAsync(`SELECT DISTINCT groups.id, groups.name FROM groups 
      JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
      JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
      WHERE lectures.course_id = ? ORDER BY groups.name;`, [courseId])
  return result
} 

export async function getAllCourses() {
  const db = await database

  return db.getAllAsync('SELECT * FROM courses;')
}

async function getGroupsForLecture(lectureId) {
  const db = await database

  return db.getAllAsync(`SELECT groups.id, groups.name FROM groups
  JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
  AND lectures_has_groups.lectures_id = ?;`, [lectureId])
}

async function getRoomsForLecture(lectureId) {
 const db = await database

  return db.getAllAsync(`SELECT rooms.id, rooms.name FROM rooms
  JOIN lectures_has_rooms ON rooms.id = lectures_has_rooms.rooms_id
  AND lectures_has_rooms.lectures_id = ?;`, [lectureId])
}

async function getLecturersForLecture(lectureId) {
  const db = await database

  return db.getAllAsync(`SELECT lecturers.id, lecturers.name FROM lecturers
  JOIN lectures_has_lecturers ON lecturers.id = lectures_has_lecturers.lecturers_id
  AND lectures_has_lecturers.lectures_id = ?;`, [lectureId])
}

async function getExecutionType(executionTypeId) {
  const db = await database

  return db.getFirstAsync(`SELECT executionTypes.executionType FROM executionTypes
  WHERE executionTypes.id = ?;`, [executionTypeId])
}

async function getLecturesForDateWithNoCurses(date) { //edge case, when there is no course attached
  const db = await database

  return db.getAllAsync(
  `SELECT * FROM lectures
  WHERE course_id = ''
  AND start_time LIKE '${date}%'`
  )
}

export async function getLecturesForDate(date) { // pazi če je execution type prazen
  const db = await database
  
  let lectures = await db.getAllAsync(
  `SELECT DISTINCT lectures.id, lectures.start_time, lectures.end_time, lectures.course_id, courses.course, lectures.executionType_id,
  eventType, note, showLink, color, colorText
  FROM groups JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
  JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
  JOIN courses ON courses.id = lectures.course_id
  JOIN selected_groups ON selected_groups.groups_id = groups.id
  AND selected_groups.courses_id = courses.id
  AND start_time LIKE '${date}%'`)

  lectures = [...lectures, ...await getLecturesForDateWithNoCurses(date)]

  for(const lecture of lectures){
    lecture.groups = await getGroupsForLecture(lecture.id)
    lecture.rooms = await getRoomsForLecture(lecture.id)
    lecture.lecturers = await getLecturersForLecture(lecture.id)
    if(lecture.executionType_id){
      lecture.executionType = (await getExecutionType(lecture.executionType_id)).executionType
      lecture.usersNote = await querryNoteForCourse(lecture.course_id, lecture.executionType_id)
    }
  }

  return lectures
}

export async function querryNumOFSelectedGroups(courses_id, groups_id) {
  const db = await database
  
  return db.getFirstAsync(`SELECT COUNT(*) AS 'num' FROM selected_groups WHERE courses_id = ? AND groups_id = ?`, [courses_id, groups_id])
}

export async function getAllDistinctSelectedGroups() {
  const db = await database

  const groupsIds = []
  for (const row of db.getEachAsync(`SELECT DISTINCT groups_id FROM selected_groups`))
    groupsIds.push({ id: row.groups_id})
  return groupsIds
}

export async function deleteLecturesBetweenDates(start_time, end_time) { // this function is INLCUSIVE for start and end date
  const db = await database
  
  start_time = getISODateNoTimestamp(start_time)
  end_time = getISODateNoTimestamp(end_time)
  return db.runAsync(`DELETE FROM lectures WHERE DATE(start_time) BETWEEN '${start_time}' AND '${end_time}'`)
}

export async function querryNoteForCourse(courseId, executionTypeId) {
  const db = await database

  return db.getFirstAsync(`SELECT * FROM notes WHERE courses_id = ? AND executionType_id = ?`, [courseId, executionTypeId])
}

export async function deleteNoteForCourse(courseId, executionTypeId) {
   const db = await database

  return db.getFirstAsync(`DELETE FROM notes WHERE courses_id = ? AND executionType_id = ?`, [courseId, executionTypeId])
}

export async function setNoteForCourse(note, courseId, executionTypeId) {
  const db = await database

  await deleteNoteForCourse(courseId, executionTypeId)
  return db.getFirstAsync(`INSERT INTO notes (note, courses_id, executionType_id) VALUES (?, ?, ?)`, [note, courseId, executionTypeId])
}