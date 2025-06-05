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

export type Lecture = {
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