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