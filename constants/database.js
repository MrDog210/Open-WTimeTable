export const CREATE_DATABASE = `CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
  course VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS executionTypes (
  id VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
  executionType VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS lecturers (
  id VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
  name VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS lectures (
  id VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
  start_time VARCHAR(40),
  end_time VARCHAR(40),
  eventType VARCHAR(100),
  note TEXT,
  showLink VARCHAR(150),
  color VARCHAR(10),
  colorText TEXT,
  executionType_id VARCHAR(20),
  FOREIGN KEY (executionType_id) REFERENCES executionTypes (id)
);

CREATE TABLE IF NOT EXISTS lectures_has_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  groups_id INTEGER NOT NULL,
  lectures_id VARCHAR(20) NOT NULL,
  FOREIGN KEY (groups_id) REFERENCES groups (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id)
);

CREATE TABLE IF NOT EXISTS lectures_has_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  courses_id VARCHAR(20) NOT NULL,
  lectures_id VARCHAR(20) NOT NULL,
  FOREIGN KEY (courses_id) REFERENCES courses (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id)
);

CREATE TABLE IF NOT EXISTS lectures_has_lecturers (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  lecturers_id INTEGER NOT NULL,
  lectures_id VARCHAR(20) NOT NULL,
  FOREIGN KEY (lecturers_id) REFERENCES lecturers (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id)
);

CREATE TABLE IF NOT EXISTS lectures_has_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
  rooms_id INTEGER NOT NULL,
  lectures_id VARCHAR(20) NOT NULL,
  FOREIGN KEY (rooms_id) REFERENCES rooms (id),
  FOREIGN KEY (lectures_id) REFERENCES lectures (id)
);`