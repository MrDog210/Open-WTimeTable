import Storage from 'expo-sqlite/kv-store';
import { CustomLecture, Lecture } from '../../types/types';

export async function getCustomLectures() {
  const data = await Storage.getItem('customLectures')

  if(data)
    return JSON.parse(data) as CustomLecture[]
  return []
}

export async function setCustomLectures(customLectures: CustomLecture) {
  return Storage.setItem('customLectures', JSON.stringify(customLectures))
}

export async function getCustomLecturesForDates(dates = []) {
  const lectures = await getCustomLectures()
  const final = []

  for (const d of dates) {
    const date = new Date(d)
    const dayIndex = date.getDay() - 1 < 0 ? 6 : date.getDay() - 1 // monday - 0
    console.log("processing day: ", date)

    for(const lecture of lectures) {
      if (!lecture.days_of_week[dayIndex])
        continue

      const startTime = new Date(date);
      const lectureStart = new Date(lecture.start_time);
      startTime.setHours(lectureStart.getHours(), lectureStart.getMinutes(), lectureStart.getSeconds(), lectureStart.getMilliseconds());

      const endTime = new Date(date);
      const lectureEnd = new Date(lecture.end_time);
      endTime.setHours(lectureEnd.getHours(), lectureEnd.getMinutes(), lectureEnd.getSeconds(), lectureEnd.getMilliseconds());

      final.push({
        lecture: {
          ...lecture,
          start_time: startTime,
          end_time: endTime,
          lecturers: lecture.lecturers.map((l, index) => ({name: l, id: index})),
          groups: lecture.groups.map((l, index) => ({name: l, id: index})),
          rooms: lecture.rooms.map((l, index) => ({name: l, id: index})),
          usersNote: { id: -1, note: lecture.usersNote}
        },
        startDate: startTime,
        endDate: endTime
      })
    }
  }

  return final
}