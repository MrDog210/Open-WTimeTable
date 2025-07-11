import { Storage } from '@op-engineering/op-sqlite';

export const API_URL = 'https://wise-tt.com/WTTWebRestAPI/ws/rest/'
export const USERNAME = process.env.EXPO_PUBLIC_USERNAME
export const PASSWORD = process.env.EXPO_PUBLIC_PASSWORD

export const GITHUB_REPO = 'https://github.com/MrDog210/Open-WTimeTable'
export const LICENSE = 'https://github.com/MrDog210/Open-WTimeTable/blob/master/LICENSE'
export const CONTR_MRDOG210 = 'https://github.com/MrDog210'
export const CONTR_MZHAP = 'https://github.com/mzHap'

export const DONATION_LINK = 'https://buymeacoffee.com/mrdog210'

export const storage = new Storage({})

export const CREATE_DATABASE = [/*`DROP TABLE IF EXISTS lectures_has_groups`,
`DROP TABLE IF EXISTS lectures_has_lecturers`,
`DROP TABLE IF EXISTS lectures_has_rooms`,
`DROP TABLE IF EXISTS selected_groups`,
`DROP TABLE IF EXISTS notes`,
`DROP TABLE IF EXISTS groups`,
`DROP TABLE IF EXISTS rooms`,
`DROP TABLE IF EXISTS courses`,
`DROP TABLE IF EXISTS executionTypes`,
`DROP TABLE IF EXISTS lecturers`,
`DROP TABLE IF EXISTS lectures`,*/
`CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(250)
)`,
`CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(100)
)`,
`CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  course VARCHAR(200)
)`,
`CREATE TABLE IF NOT EXISTS executionTypes (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  executionType VARCHAR(50)
)`,
`CREATE TABLE IF NOT EXISTS lecturers (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(200)
)`,
`CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  start_time VARCHAR(40),
  end_time VARCHAR(40),
  eventType VARCHAR(100),
  note TEXT,
  showLink VARCHAR(150),
  color VARCHAR(10),
  colorText TEXT,
  executionType_id INTEGER,
  course_id INTEGER,
  FOREIGN KEY (executionType_id) REFERENCES executionTypes (id),
  FOREIGN KEY (course_id) REFERENCES courses (id)
)`,
`CREATE TABLE IF NOT EXISTS lectures_has_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  groups_id INTEGER NOT NULL,
  lectures_id INTEGER NOT NULL,
  FOREIGN KEY (groups_id) REFERENCES groups (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id) ON DELETE CASCADE
)`,
`CREATE TABLE IF NOT EXISTS lectures_has_lecturers (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  lecturers_id INTEGER NOT NULL,
  lectures_id INTEGER NOT NULL,
  FOREIGN KEY (lecturers_id) REFERENCES lecturers (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id) ON DELETE CASCADE
)`,
`CREATE TABLE IF NOT EXISTS lectures_has_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  rooms_id INTEGER NOT NULL,
  lectures_id INTEGER NOT NULL,
  FOREIGN KEY (rooms_id) REFERENCES rooms (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id) ON DELETE CASCADE
)`,
`CREATE TABLE IF NOT EXISTS selected_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  courses_id INTEGER NOT NULL,
  groups_id INTEGER NOT NULL,
  FOREIGN KEY (courses_id) REFERENCES courses (id),
  FOREIGN KEY (groups_id) REFERENCES groups (id)
)`,
`CREATE TABLE IF NOT EXISTS notes (
	id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
	note TEXT NOT NULL,
	courses_id INTEGER NOT NULL,
	executionType_id INTEGER NOT NULL,
	FOREIGN KEY (courses_id) REFERENCES courses (id),
	FOREIGN KEY (executionType_id) REFERENCES executionTypes (id)
)`,
`CREATE UNIQUE INDEX IF NOT EXISTS index_group_id ON groups(id);`,
`CREATE UNIQUE INDEX IF NOT EXISTS index_rooms_id ON rooms(id);`,
`CREATE UNIQUE INDEX IF NOT EXISTS index_courses_id ON courses(id);`,
`CREATE UNIQUE INDEX IF NOT EXISTS index_executionTypes_id ON executionTypes(id);`,
`CREATE UNIQUE INDEX IF NOT EXISTS index_lecturers_id ON lecturers(id);`,
//`CREATE INDEX IF NOT EXISTS lectures_date_index ON lectures(start_time, end_time);`
]

export const DELETE_COMMANDS = [
`DELETE FROM lectures_has_lecturers;`,
`DELETE FROM lectures_has_rooms;`,
`DELETE FROM lectures_has_groups;`,
`DELETE FROM selected_groups`,
`DELETE FROM notes`,
`DELETE FROM groups`,
`DELETE FROM rooms`,
`DELETE FROM courses`,
`DELETE FROM executionTypes`,
`DELETE FROM lecturers`,
`DELETE FROM lectures`]