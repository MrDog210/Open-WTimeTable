export type Group = {
  id: string,
  name: string
}

export type SchoolInfo = {
  schoolCode: string,
  schoolCity: string,
  schoolName: string,
  firstDayOfWeek: number,
  lastChangeDate: string
}

export type GroupLecture = {
  id: number,
  name: string
}

export type Programme = {
  id: string,
  name: string,
  year: string
}

export type Branch = {
  id: string,
  branchName: string
}

export type BranchLecture = {
  id: number,
  name: string
}

export type Room = {
  id: number,
  name: string
}

export type GroupBranchChild = {
  id: number,
  name: string
}

export type GroupBranchMain = {
  id: string,
  name: string,
  childGroups: GroupBranchChild[]
}

export type Lecturer = {
  id: number,
  name: string
}

export type LectureWise = {
  id: string,
  start_time: string,
  end_time: string,
  courseId: string,
  course: string,
  eventType: string,
  note: string,
  executionTypeId: string,
  executionType: string,
  branches: BranchLecture[],
  rooms: Room[],
  groups: GroupLecture[],
  lecturers: Lecturer[],
  showLink: string,
  color: string,
  colorText: string
}

export type Lecture = {
  id: number
  start_time: string,
  end_time: string,
  courseId: number,
  course_id: number, // TODO: change delete this and rename it
  course: string,
  eventType: string,
  note: string,
  executionType_id: number, // TODO: change delete this and rename it
  executionTypeId: number,
  executionType: string,
  branches: BranchLecture[],
  rooms: Room[],
  groups: GroupLecture[],
  lecturers: Lecturer[],
  showLink: string,
  color: string,
  colorText: string,
  usersNote: UsersNote | null
}

export type CustomLecture = {
  id: string,
  course: string,
  note: string,
  start_time: string,
  end_time: string,
  rooms: Room[],
  groups: GroupLecture[],
  lecturers: Lecturer[],
  days_of_week: boolean[],
  usersNote: {
    id: number,
    note: string
  },
}

export type Course = {
  id: number,
  course: string
}

export type UsersNote = {
  id: number,
  note: string,
  courses_id: number,
  executionType_id: number
}

export type TimetableLecture = {
  lecture: Lecture,
  startDate: string,
  endDate: string
}

export interface GroupWithSelected extends GroupBranchChild {
  selected: boolean
}

export type ExecutionType = {
  id: number,
  executionType: string
}