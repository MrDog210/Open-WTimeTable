import Storage from 'expo-sqlite/kv-store';
import { CustomLecture, Lecture, TimetableLecture } from '../../types/types';
import { subtrackSeconds } from '../dateUtils';

export async function getCustomLectures() {
  const data = await Storage.getItem('customLectures')

  if(data)
    return JSON.parse(data) as CustomLecture[]
  return []
}

export async function setCustomLectures(customLectures: CustomLecture[]) {
  return Storage.setItem('customLectures', JSON.stringify(customLectures))
}

export async function getCustomLecturesForDates(dates: Date[]): Promise<TimetableLecture[]> {
  const lectures = await getCustomLectures()
  const final: TimetableLecture[] = []

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
        lecture: lecture as any,
        startDate: subtrackSeconds(startTime, -60), 
        endDate: subtrackSeconds(endTime, 60)
      })
    }
  }

  return final
}