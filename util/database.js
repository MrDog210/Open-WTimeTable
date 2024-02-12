import * as SQLite from 'expo-sqlite';
import { CREATE_DATABASE } from '../constants/database';

const database = SQLite.openDatabase('lectures.db')

function handleError(_,error) {
  console.log('DB ERROR: ' + error)
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

export function insertGroup(id, name) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO groups (id, name) VALUES (?,?);', [id, name], () => {}, handleError)
  })
}

export function getAllGroups() {
  database.transaction((tx) => {
    tx.executeSql('SELECT * FROM groups;', [], (_, result) => {
      console.log('quarried')
      for (const dp of result.rows._array){
        console.log(dp)
      }
    }, handleError)
  })
  console.log('AAAAfdsf')
}

export function insertRoom(id, name) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO rooms (id, name) VALUES (?,?);', [id, name], () => {}, handleError)
  })
}

export function insertLecturer(id, name) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lecturers (id, name) VALUES (?,?);', [id, name], () => {}, handleError)
  })
}

export function insertExecutionType(id, executionType) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType], () => {}, handleError)
  })
}

export function insertCourse(id, course) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO courses (id, course) VALUES (?,?);', [id, course], () => {}, handleError)
  })
}

export function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, course_id, executionType_id, branches, rooms, groups, lecturers}) {
  let lectureId;
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
                                        [start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id], 
      (_, resultSet) => {
        lectureId = resultSet.insertId
      }, handleError)
  })
  return lectureId;
}
