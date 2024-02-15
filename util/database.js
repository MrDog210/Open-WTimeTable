import * as SQLite from 'expo-sqlite/next';
import { CREATE_DATABASE, DELETE_COMMANDS } from '../constants/database';

const database = SQLite.openDatabaseSync('lectures.db')

export async function init() {
  return CREATE_DATABASE.forEach(async sql => {
    console.log('creating table')
    await database.execAsync(sql)
  }) // i hate this
}

export function truncateDatabase() {
  for(const sql of DELETE_COMMANDS) {
    database.execSync(sql)
  }
}

export async function insertGroup(id, name) {
  return database.runAsync('INSERT OR IGNORE INTO groups (id, name) VALUES (?,?);', [id, name])
} 

export async function insertRoom(id, name) {
  return database.runAsync('INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name])
}

export async function insertLecturer(id, name) {
  return database.runAsync('INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name])
}

export async function insertExecutionType(id, executionType) {
  return database.runAsync('INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType])
}

export async function insertCourse(id, course) {
  return database.runAsync('INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course])
}

export async function insertLecturesHasGroups(lecturesId, groupsId) {
  return database.runAsync('INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?,?);', [lecturesId, groupsId])
}

export async function insertLecturesHasLecturers(lecturesId, lecturersId) {
  return database.runAsync('INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lecturesId, lecturersId])
}

export async function insertLecturesHasRooms(lecturesId, roomsId) {
  return database.runAsync('INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lecturesId, roomsId])
}

export async function truncateSelectedGroups() {
  return database.execAsync('DELETE FROM selected_groups;')
}

export async function insertSelectedGroups(courses_id, groups_id) {
  return database.runAsync('INSERT INTO selected_groups (courses_id, groups_id) VALUES (?,?);', [courses_id, groups_id])
}

export async function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}) {
  const result = database.runSync('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
      [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId]) 

    //console.log('result: ' + resultSet.insertId)
    let lectureId = result.lastInsertRowId
    rooms.forEach(async room => { insertLecturesHasRooms(lectureId, Number(room.id))})
    lecturers.forEach(async lecturer => { insertLecturesHasLecturers(lectureId, Number(lecturer.id))})
    for( const group of groups) {
      await insertLecturesHasGroups(lectureId, Number(group.id))
    }
}

export async function getAllDistinctGroupsOfCourse(courseId) {
  const result = await database.getAllAsync(`SELECT DISTINCT groups.id, groups.name FROM groups 
      JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
      JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
      WHERE lectures.course_id = ?;`, [courseId])
  return result
} 

export async function getAllCourses() {
  return database.getAllAsync('SELECT * FROM courses;')
}

function getGroupsForLecture(lectureId) {
  return database.getAllSync(`SELECT groups.id, groups.name FROM groups
  JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
  AND lectures_has_groups.lectures_id = ?;`, [lectureId])
}

function getRoomsForLecture(lectureId) {
  return database.getAllSync(`SELECT rooms.id, rooms.name FROM rooms
  JOIN lectures_has_rooms ON rooms.id = lectures_has_rooms.rooms_id
  AND lectures_has_rooms.lectures_id = ?;`, [lectureId])
}

function getLecturersForLecture(lectureId) {
  return database.getAllSync(`SELECT lecturers.id, lecturers.name FROM lecturers
  JOIN lectures_has_lecturers ON lecturers.id = lectures_has_lecturers.lecturers_id
  AND lectures_has_lecturers.lectures_id = ?;`, [lectureId])
}

function getExecutionType(executionTypeId) {
  return database.getFirstSync(`SELECT executionTypes.executionType FROM executionTypes
  WHERE executionTypes.id = ?;`, [executionTypeId])
}

function getLecturesForDateWithNoCurses(date) { //edge case, when there is no course attached
  return database.getAllSync(
  `SELECT * FROM lectures
  WHERE course_id = ''
  AND start_time LIKE '${date}%'`
  )
}

export async function getLecturesForDate(date) { // pazi če je execution type prazen
  let lectures = database.getAllSync(
  `SELECT DISTINCT lectures.id, lectures.start_time, lectures.end_time, courses.course, lectures.executionType_id,
  eventType, note, showLink, color, colorText
  FROM groups JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
  JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
  JOIN courses ON courses.id = lectures.course_id
  JOIN selected_groups ON selected_groups.groups_id = groups.id
  AND selected_groups.courses_id = courses.id
  AND start_time LIKE '${date}%'`)

  lectures = [...lectures, ...getLecturesForDateWithNoCurses(date)]

  lectures.forEach(lecture => {
    lecture.groups = getGroupsForLecture(lecture.id)
    lecture.rooms = getRoomsForLecture(lecture.id)
    lecture.lecturers = getLecturersForLecture(lecture.id)
    if(lecture.executionType_id)
      lecture.executionType = getExecutionType(lecture.executionType_id).executionType
  })

  return lectures
}