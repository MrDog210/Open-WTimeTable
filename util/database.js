import * as SQLite from 'expo-sqlite';
import { CREATE_DATABASE, DELETE_COMMANDS } from '../constants/database';
import { Group } from './groupUtil';

const database = SQLite.openDatabase('lectures1.db')

function handleError(_,error) {
  console.log('DB ERROR: ' + error)
  throw new Error(error)
}

function handleTransactionError(error) {
  console.log('DB ERROR: ' + error)
  throw new Error(error)
}

export function init() {
  CREATE_DATABASE.forEach(sql => {
    database.transaction((tx) => {
      tx.executeSql(sql, [], 
        () => {console.log('success')}, // če je sucsses
        handleError)
    }, () => {console.log("ERROR CREATING DB")})
  }) // i hate this
}

export async function truncateDatabase() {
  for(const sql of DELETE_COMMANDS) {
    console.log(sql)
    await database.transactionAsync(async tx => {
      return tx.executeSqlAsync(sql)
    })
  }
}

export async function insertGroup(id, name) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT INTO groups (id, name) VALUES (?,?);', [id, name])
  })
} 

/* export function getAllGroups() {
  database.transaction((tx) => {
    tx.executeSql('SELECT * FROM groups;', [], (_, result) => {
      console.log('quarried')
      for (const dp of result.rows._array){
        console.log(dp)
      }
    }, handleError)
  })

  console.log('end')
}*/

export async function insertRoom(id, name) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name])
  })
}

export async function insertLecturer(id, name) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name])
  })
}

export async function insertExecutionType(id, executionType) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType])
  })
}

export async function insertCourse(id, course) {
  console.log('start course')
  return await database.transactionAsync(async (tx) => {
    console.log('inserting course')
    const promise = await tx.executeSqlAsync('INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course])
    console.log('done course')
    return promise
  })
}

export async function insertLecturesHasGroups(lecturesId, groupsId) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?,?);', [lecturesId, groupsId])
  })
}

export async function insertLecturesHasLecturers(lecturesId, lecturersId) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lecturesId, lecturersId])
  })
}

export async function insertLecturesHasRooms(lecturesId, roomsId) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lecturesId, roomsId])
  })
}

export async function insertSelectedGroups(courses_id, groups_id) {
  return database.transactionAsync(async (tx) => {
    return tx.executeSqlAsync('INSERT INTO selected_groups (courses_id, groups_id) VALUES (?,?);', [courses_id, groups_id])
  })
}

export async function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}) {
  return database.transactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
      [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId]) 

    //console.log('result: ' + resultSet.insertId)
    let lectureId = result.insertId
    rooms.forEach(async room => { await insertLecturesHasRooms(lectureId, Number(room.id))})
    groups.forEach(async group => { await insertLecturesHasGroups(lectureId, Number(group.id))})
    lecturers.forEach(async lecturer => { await insertLecturesHasLecturers(lectureId, Number(lecturer.id))})
  }).catch(handleTransactionError)
}

export async function getAllLectures() {
  console.log('called function')
  return database.transactionAsync(async (tx) => {
    console.log('quring lecturers')
    const result = await tx.executeSqlAsync('SELECT * FROM lectures;')
    console.log('lecturers:', result.rows);
  })
}

/* export function getAllDistinctGroupsOfCourse(courseId) {
  const promise = new Promise ((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(`SELECT DISTINCT groups.id, groups.name FROM groups 
      JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
      JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
      WHERE lectures.course_id = ?;`, [courseId], 
      (_, result) => {
        const groups = []
        console.log(result.rows._array)
        for (const row of result.rows._array) {
          groups.push(new Group(row.id, row.name))
        }
        resolve(groups)
      }, (_, error) => {reject(error)})
    })
  })

  return promise
} */