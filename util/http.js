import ky from "ky";
import { getToken } from "./token.js";
import { getServerUrl, setSchoolInfo, setServerUrl } from "../store/schoolInfo.js";
import { URL } from '../constants/http.js'

function handleError(error) {
  console.log(error)

  throw new Error(error)
}

async function fetchWithToken(url) {
  const token = await getToken()

  const json = await ky.get(url, {
    headers: new Headers ({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
  })}).json().catch(handleError)

  return json
}

async function fetchSchoolUrl(schoolCode) {
  let json = await fetchWithToken(URL + `url?schoolCode=${schoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(schoolCode) {
  schoolCode = schoolCode.toLowerCase()

  const serverURL = await fetchSchoolUrl(schoolCode)
  setServerUrl(serverURL)

  let schoolInfo = await fetchWithToken(serverURL + `schoolCode?schoolCode=${schoolCode}&language=slo`)
  await setSchoolInfo(schoolInfo)

  return schoolInfo
}

export async function getBasicProgrammes(schoolCode) {
  const url = await getServerUrl()

  const json = await fetchWithToken(url + `basicProgrammeAll?schoolCode=${schoolCode}&language=slo`)
  console.log(json)

  return json
}

/*const basicPrograms = [
  {
    id: 1,
    name: 'ŠTRUMAR BU',
    year: 1
  },
  {
    id: 2,
    name: 'RIT',
    year: 2
  }
]*/