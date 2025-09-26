// TODO: replace with library, day.js?

import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear' // ES 2015

dayjs.extend(weekOfYear);

export function subtrackSeconds(dateString: Date | string, seconds: number) {
  let date = new Date(dateString)
  date.setSeconds(date.getSeconds() - seconds)
  return date.toISOString()
}

export function getISODateNoTimestamp(date: Date) {
  const [withoutTime] = date.toISOString().split('T');
  return withoutTime
}

export function getTimeFromDate(dateString: Date | string) {
  const date = new Date(dateString)
  let minutes = date.getMinutes().toString()
  if(minutes.length === 1)
    minutes = '0' + minutes
  return `${date.getHours()}:${minutes}`
}

export function formatDate(date: Date | string) {
  date = new Date(date)
  return date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
}

export function formatWeekDate(fromDate: Date | string, toDate: Date | string) {
  fromDate = new Date(fromDate)
  toDate = new Date(toDate)
  return `${fromDate.getDate()}.${fromDate.getMonth() + 1} - ${toDate.getDate()}.${toDate.getMonth() + 1}`
}

export function getMonday(d: Date | string) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getFriday(d: Date | string) {
  d = getMonday(d)
  const diff = d.getDate() + 4
  return new Date(d.setDate(diff));
}

export function getWeekDates(date: Date | string) {
  return {from: getMonday(date), till: getFriday(date)}
}

export function getDates(startDate: Date, stopDate: Date) {
  //console.log('start' + startDate.toISOString())
  const dateArray: Date[] = new Array();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export function getSchoolYearDates() {
  const currentDate = new Date()
  let startDate, endDate
  if(currentDate.getMonth()>=8) { // then we start this year to +1
    startDate = new Date(`${currentDate.getFullYear()}-09-01`)
    endDate = new Date(`${currentDate.getFullYear()+1}-08-30`)
  } else {
    startDate = new Date(`${currentDate.getFullYear()-1}-09-01`)
    endDate = new Date(`${currentDate.getFullYear()}-08-30`)
  }

  return {startDate, endDate}
}

export function getSchoolYearDates2(currentDate: Date) {
  let startDate, endDate
  if(currentDate.getMonth()>=9) { // then we start this year to +1
    startDate = new Date(`${currentDate.getFullYear()}-10-01`)
    endDate = new Date(`${currentDate.getFullYear()+1}-09-30`)
  } else {
    startDate = new Date(`${currentDate.getFullYear()-1}-10-01`)
    endDate = new Date(`${currentDate.getFullYear()}-09-30`)
  }

  return {startDate, endDate}
}

export function dateFromNow(daysToAdd: number) {
  let date = new Date()
  return new Date(date.setDate(date.getDate()+daysToAdd));
}

export function addDaysToDate(date: Date, daysToAdd: number) {
  const newDate = new Date(date.getTime())
  newDate.setDate(newDate.getDate() + daysToAdd)
  return newDate;
}

export function getElapsedSecondsFromDate(startDate: Date | string) {
  startDate = new Date(startDate)
  let endDate = new Date();
  return (endDate.getTime() - startDate.getTime()) / 1000;
}

export function getSchoolWeekNumber(date: Date): number {
  const {startDate} = getSchoolYearDates2(date)
  const startWeek = dayjs(startDate).week()
  const week = dayjs(date).week() - startWeek + 1
  return week <= 0 ? 52 + week : week
}