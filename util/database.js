import * as SQLite from 'expo-sqlite';
import { CREATE_DATABASE, DELETE_COMMANDS } from '../constants/database';
import { Group } from './groupUtil';

const database = SQLite.openDatabase('lectures.db')

function handleError(_,error) {
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

export function truncateDatabase() {
  DELETE_COMMANDS.forEach(sql => {
    database.transaction((tx) => {
      tx.executeSql(sql, [], 
        () => {console.log('success')},
        handleError)
    }, handleError)
  })
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

  console.log('end')
}

export function insertRoom(id, name) {
  database.transaction((tx) => {
    tx.executeSql('INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name], () => {}, handleError)
  })
}

export function insertLecturer(id, name) {
  database.transaction((tx) => {
    tx.executeSql('INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name], () => {}, handleError)
  })
}

export function insertExecutionType(id, executionType) {
  database.transaction((tx) => {
    tx.executeSql('INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType], () => {}, handleError)
  })
}

export function insertCourse(id, course) {
  database.transaction((tx) => {
    tx.executeSql('INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course], () => {}, handleError)
  })
}

export function insertLecturesHasGroups(lecturesId, groupsId) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?,?);', [lecturesId, groupsId], () => {}, handleError)
  })
}

export function insertLecturesHasLecturers(lecturesId, lecturersId) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lecturesId, lecturersId], () => {}, handleError)
  })
}

export function insertLecturesHasRooms(lecturesId, roomsId) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lecturesId, roomsId], () => {}, handleError)
  })
}

export function insertSelectedGroups(courses_id, groups_id) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO selected_groups (courses_id, groups_id) VALUES (?,?);', [courses_id, groups_id], () => {}, handleError)
  })
}

export function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}) {
  database.transaction((tx) => {
    tx.executeSql('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
                                        [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId], 
      (_, resultSet) => {
        //console.log('result: ' + resultSet.insertId)
        let lectureId = resultSet.insertId
        rooms.forEach(room => {insertLecturesHasRooms(lectureId, Number(room.id))})
        groups.forEach(group => {insertLecturesHasGroups(lectureId, Number(group.id))})
        lecturers.forEach(lecturer => {insertLecturesHasLecturers(lectureId, Number(lecturer.id))})
      }, handleError)
  })
}


export function getAllLectures() {
  database.transaction((tx) => {
    tx.executeSql('SELECT * FROM lectures;', [], (_, result) => {
      console.log('quarried')
      for (const dp of result.rows._array){
        console.log(dp)
      }
    }, handleError)
  })
}


export function getAllDistinctGroupsOfCourse(courseId) {
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
}