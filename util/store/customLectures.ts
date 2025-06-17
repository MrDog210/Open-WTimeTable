import Storage from 'expo-sqlite/kv-store';
import { CustomLecture, Lecture, TimetableLecture } from '../../types/types';
import { addDaysToDate, getISODateNoTimestamp, getMonday, subtrackSeconds } from '../dateUtils';
import { MarkedDates } from 'react-native-calendars/src/types';

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



export async function markDatesForCustomLectures(markedDates: MarkedDates) {
  const NUM_OF_WEEKS = 4 // number of weeks to calculate for
  const lectures = await getCustomLectures()

  if(lectures.length === 0)
    return
  const days = lectures[0].days_of_week
  for(let i = 1; i < lectures.length; i++) {
    const d = lectures[i].days_of_week
    for(let j = 1; j < d.length; j++)
      if(d[j])
        days[j] = true
  }

  let monday = addDaysToDate(getMonday(new Date()), -7 * NUM_OF_WEEKS)
  for(let i = 0; i < NUM_OF_WEEKS * 2; i++) {
    for(let j = 0; j < days.length; j++) {
      if(!days[j]) continue

      const day = getISODateNoTimestamp(addDaysToDate(monday, j))
      if(!markedDates[day]) {
        markedDates[day] = {
          marked: true
        }
      }
    }
    monday = addDaysToDate(monday, 7)
  }
}