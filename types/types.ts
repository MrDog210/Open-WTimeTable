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
  course: string,
  eventType: string,
  note: string,
  executionTypeId: number,
  executionType: string,
  branches: BranchLecture[],
  rooms: Room[],
  groups: GroupLecture[],
  lecturers: Lecturer[],
  showLink: string,
  color: string,
  colorText: string,
  executionType_id: number,
  course_id: number,
  usersNote: UsersNote | null
}

export interface CustomLecture extends Lecture { // TODO: fix this type
  days_of_week: boolean[],
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


export interface GroupWithSelected extends GroupBranchChild {
  selected: boolean
}