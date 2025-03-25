
export function subtrackSeconds(dateString, seconds) {
  let date = new Date(dateString)
  date.setSeconds(date.getSeconds() - seconds)
  return date.toISOString()
}

export function getISODateNoTimestamp(date) {
  const [withoutTime] = date.toISOString().split('T');
  return withoutTime
}

export function getTimeFromDate(dateString) {
  const date = new Date(dateString)
  let minutes = date.getMinutes().toString()
  if(minutes.length === 1)
    minutes = '0' + minutes
  return `${date.getHours()}:${minutes}`
}

export function formatDate(date) {
  date = new Date(date)
  return date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
}

export function formatWeekDate(fromDate, toDate) {
  fromDate = new Date(fromDate)
  toDate = new Date(toDate)
  return `${fromDate.getDate()}.${fromDate.getMonth() + 1} - ${toDate.getDate()}.${toDate.getMonth() + 1}`
}

export function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + 1; // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getFriday(d) {
  d = getMonday(d)
  diff = d.getDate() + 4
  return new Date(d.setDate(diff));
}

export function getWeekDates(date) {
  return {from: getMonday(date), till: getFriday(date)}
}

export function getDates(startDate, stopDate) {
  console.log('start' + startDate.toISOString())
  var dateArray = new Array();
  var currentDate = startDate;
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
    endDate = new Date(`${currentDate.getFullYear()+1}-08-01`)
  } else {
    startDate = new Date(`${currentDate.getFullYear()-1}-09-01`)
    endDate = new Date(`${currentDate.getFullYear()}-08-01`)
  }

  return {startDate, endDate}
}

export function dateFromNow(daysToAdd) {
  let date = new Date()
  return new Date(date.setDate(date.getDate()+daysToAdd));
}

export function getElapsedSecondsFromDate(startDate) {
  startDate = new Date(startDate)
  let endDate = new Date();
  return (endDate.getTime() - startDate.getTime()) / 1000;
}