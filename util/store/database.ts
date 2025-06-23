import { open, SQLBatchTuple } from '@op-engineering/op-sqlite';
import { CREATE_DATABASE, DELETE_COMMANDS } from '../constants';
import { Course, ExecutionType, GroupBranchChild, GroupLecture, Lecture, LectureWise, Lecturer, Room, UsersNote } from '../../types/types';
import { getISODateNoTimestamp } from '../dateUtils';

const db = open({
  name: 'lectures2.db',
});

export async function init() {
  for (const sql of CREATE_DATABASE) {
    console.log('creating table')
    await db.executeWithHostObjects(sql)
  }
}

export async function truncateDatabase() {
  for(const sql of DELETE_COMMANDS) {
    await db.executeWithHostObjects(sql)
  }
}

export async function batchInsertGRLETC(
  rooms: Room[],
  groups: GroupLecture[],
  lecturers: Lecturer[],
  executionTypes: ExecutionType[],
  coures: Course[]
) {
  const statments: SQLBatchTuple[] = []
  for(const {id, name} of rooms)
    statments.push(['INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name]])
  for(const {id, name} of groups)
    statments.push(['INSERT OR IGNORE INTO groups (id, name) VALUES (?,?);', [id, name]])
  for(const {id, name} of lecturers)
    statments.push(['INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name]])
  for(const {id, executionType} of executionTypes)
    statments.push(['INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType]])
  for(const {id, course} of coures)
    statments.push(['INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course]])

  return db.executeBatch(statments)
}

export async function insertGroup(id: number, name: string) {
  
  return db.executeWithHostObjects('INSERT OR IGNORE INTO groups (id, name) VALUES (?,?);', [id, name])
} 

export async function insertRoom(id: number, name: string) {
  
  return db.executeWithHostObjects('INSERT OR IGNORE INTO rooms (id, name) VALUES (?,?);', [id, name])
}

export async function insertLecturer(id: number, name: string) {
  
  return db.executeWithHostObjects('INSERT OR IGNORE INTO lecturers (id, name) VALUES (?,?);', [id, name])
}

export async function insertExecutionType(id: number, executionType: string) {
  
  return db.executeWithHostObjects('INSERT OR IGNORE INTO executionTypes (id, executionType) VALUES (?,?);', [id, executionType])
}

export async function insertCourse(id: number, course: string) {
  
  return db.executeWithHostObjects('INSERT OR IGNORE INTO courses (id, course) VALUES (?,?);', [id, course])
}

export async function insertLecturesHasGroups(lecturesId: number, groupsId: number) {
  
  return db.executeWithHostObjects('INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?, ?);', [lecturesId, groupsId])
}

export async function insertLecturesHasLecturers(lecturesId: number, lecturersId: number) {
  
  return db.executeWithHostObjects('INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lecturesId, lecturersId])
}

export async function insertLecturesHasRooms(lecturesId: number, roomsId: number) {
  
  return db.executeWithHostObjects('INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lecturesId, roomsId])
}

export async function truncateSelectedGroups() {
  
  return db.executeWithHostObjects('DELETE FROM selected_groups;')
}

export async function insertSelectedGroup(courses_id: number, groups_id: number) {
  
  return db.executeWithHostObjects('INSERT INTO selected_groups (courses_id, groups_id) VALUES (?,?);', [courses_id, groups_id])
}

/*
export async function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}: LectureWise) {
  return db.transaction(async (tx) => {
    const { insertId } = await tx.execute('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
      [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId])
    const promises: Promise<any>[] = []
    for (const { id } of rooms) {
      promises.push(tx.execute(
        'INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?, ?);',
        [insertId!, Number(id)]
      ))
    }

    for (const { id } of lecturers) {
      promises.push(tx.execute(
        'INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?, ?);',
        [insertId!, Number(id)]
      ))
    }

    for (const { id } of groups) {
      promises.push(tx.execute(
        'INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?, ?);',
        [insertId!, Number(id)]
      ))
    }

    await Promise.all(promises)
  })
}
*/
export async function insertLecture({start_time, end_time, eventType, note, showLink, color, colorText, courseId, executionTypeId, branches, rooms, groups, lecturers}: LectureWise) {
  const result = await db.execute('INSERT INTO lectures (start_time, end_time, eventType, note, showLink, color, colorText, executionType_id, course_id) VALUES (?,?,?,?,?,?,?,?,?);', 
      [start_time, end_time, eventType, note, showLink, color, colorText, executionTypeId, courseId]) 

  let lectureId = result.insertId!
  const statments: SQLBatchTuple[] = []
  for(const {id} of rooms)
    statments.push(['INSERT INTO lectures_has_rooms (lectures_id, rooms_id) VALUES (?,?);', [lectureId, Number(id)]])
  for(const {id} of lecturers)
    statments.push(['INSERT INTO lectures_has_lecturers (lectures_id, lecturers_id) VALUES (?,?);', [lectureId, Number(id)]])
  for(const {id} of groups)
    statments.push(['INSERT INTO lectures_has_groups (lectures_id, groups_id) VALUES (?, ?);', [lectureId, Number(id)]])

  return db.executeBatch(statments)
}

export async function getAllDistinctGroupsOfCourse(courseId: number) {
  const { rows } = await db.executeWithHostObjects(`SELECT DISTINCT groups.id, groups.name FROM groups 
    JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
    JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
    WHERE lectures.course_id = ? ORDER BY groups.name;`, [courseId])
  
  return rows as GroupBranchChild[]
} 

export async function getAllCourses() {
  const { rows } = await db.executeWithHostObjects('SELECT * FROM courses;')
  return rows as Course[]
}

async function getGroupsForLecture(lectureId: number) {
  const { rows } = await db.execute(`SELECT groups.id, groups.name FROM groups
    JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
    AND lectures_has_groups.lectures_id = ?;`, [lectureId])
  
  return rows as GroupBranchChild[]
}

async function getRoomsForLecture(lectureId: number) {
  const { rows } = await db.execute(`SELECT rooms.id, rooms.name FROM rooms
    JOIN lectures_has_rooms ON rooms.id = lectures_has_rooms.rooms_id
    AND lectures_has_rooms.lectures_id = ?;`, [lectureId])
  
  return rows as Room[]
}

async function getLecturersForLecture(lectureId: number) {
  const { rows } = await db.execute(`SELECT lecturers.id, lecturers.name FROM lecturers
    JOIN lectures_has_lecturers ON lecturers.id = lectures_has_lecturers.lecturers_id
    AND lectures_has_lecturers.lectures_id = ?;`, [lectureId])
  
  return rows as Lecturer[]
}

async function getExecutionType(executionTypeId: number) {
  const { rows } = await db.execute(`SELECT executionTypes.executionType FROM executionTypes
    WHERE executionTypes.id = ?;`, [executionTypeId])
  
  if(rows.length !== 0)
    return rows[0] as {executionType: string}
}

async function getLecturesForDateWithNoCurses(date: string) { //edge case, when there is no course attached
  const { rows } = await db.execute(
    `SELECT * FROM lectures
    WHERE course_id = ''
    AND start_time LIKE '${date}%'`
  )

  return rows as any as Lecture[]
}

export async function getLecturesForDate(date: string) { // pazi če je execution type prazen
  const { rows } = await db.execute(
    `SELECT DISTINCT lectures.id, lectures.start_time, lectures.end_time, lectures.course_id, courses.course, lectures.executionType_id,
    eventType, note, showLink, color, colorText
    FROM groups JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
    JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
    JOIN courses ON courses.id = lectures.course_id
    JOIN selected_groups ON selected_groups.groups_id = groups.id
    AND selected_groups.courses_id = courses.id
    AND start_time LIKE '${date}%'`)

  const lecturesNormal = rows as any as Lecture[]
  const lectures: Lecture[] = [...lecturesNormal, ...await getLecturesForDateWithNoCurses(date)]

  for(const lecture of lectures){
    lecture.groups = await getGroupsForLecture(lecture.id)
    lecture.rooms = await getRoomsForLecture(lecture.id)
    lecture.lecturers = await getLecturersForLecture(lecture.id)
    if(lecture.executionType_id){
      lecture.executionType = (await getExecutionType(lecture.executionType_id))!.executionType
      lecture.usersNote = await querryNoteForCourse(lecture.course_id, lecture.executionType_id)
    }
  }

  return lectures
}

export async function querryNumOFSelectedGroups(courses_id: number, groups_id: number) {
  const { rows } = await db.executeWithHostObjects(`SELECT COUNT(*) AS 'num' FROM selected_groups WHERE courses_id = ? AND groups_id = ?`, [courses_id, groups_id])

  if(rows.length !== 0)
    return rows[0] as {num: number}
}

export async function getAllDistinctSelectedGroups() {
  const groupsIds: { id: number }[] = []
  const { rows } = await db.executeWithHostObjects(`SELECT DISTINCT groups_id FROM selected_groups`)
  for (const row of rows)
    groupsIds.push({ id: (row as {groups_id: number}).groups_id!})
  return groupsIds
}

export async function deleteLecturesBetweenDates(start_time: Date, end_time: Date) { // this function is INLCUSIVE for start and end date
  const startTime = getISODateNoTimestamp(start_time)
  const endTime = getISODateNoTimestamp(end_time)
  return db.executeWithHostObjects(`DELETE FROM lectures WHERE DATE(start_time) BETWEEN '${startTime}' AND '${endTime}'`)
}

export async function querryNoteForCourse(courseId: number, executionTypeId: number) {
  const { rows } = await db.executeWithHostObjects(`SELECT * FROM notes WHERE courses_id = ? AND executionType_id = ?`, [courseId, executionTypeId])

  if(rows.length !== 0)
    return rows[0] as UsersNote
  return null
}

export async function deleteNoteForCourse(courseId: number, executionTypeId: number) {
   

  return db.executeWithHostObjects(`DELETE FROM notes WHERE courses_id = ? AND executionType_id = ?`, [courseId, executionTypeId])
}

export async function setNoteForCourse(note: string, courseId: number, executionTypeId: number) {
  await deleteNoteForCourse(courseId, executionTypeId)
  return db.executeWithHostObjects(`INSERT INTO notes (note, courses_id, executionType_id) VALUES (?, ?, ?)`, [note, courseId, executionTypeId])
}

// Dates are inclusive
export async function getDatesWithLectures(fromDate: string, toDate: string) {
  const { rows } = await db.executeWithHostObjects("SELECT DISTINCT date(start_time) as date FROM lectures WHERE date >= ? AND date <= ? ORDER BY date", [fromDate, toDate])
  return rows as any as {date: string}
}

export async function getAllDatesWithLectures() {
  const { rows } = await db.executeWithHostObjects(`SELECT DISTINCT date(start_time) as date FROM groups JOIN lectures_has_groups ON groups.id = lectures_has_groups.groups_id
    JOIN lectures ON lectures.id = lectures_has_groups.lectures_id
    JOIN courses ON courses.id = lectures.course_id
    JOIN selected_groups ON selected_groups.groups_id = groups.id
    AND selected_groups.courses_id = courses.id;`)
   
    return rows as any as {date: string}[]
}