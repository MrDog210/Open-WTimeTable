
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
    minutes += '0'
  return `${date.getHours()}:${minutes}`
}