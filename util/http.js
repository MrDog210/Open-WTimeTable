import ky from "ky";
import { getToken } from "./token.js";
import { setSchoolInfo, setServerUrl } from "../store/schoolInfo.js";
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

async function getSchoolUrl(schoolCode) {
  let json = await fetchWithToken(URL + `url?schoolCode=${schoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(schoolCode) {
  schoolCode = schoolCode.toLowerCase()

  const serverURL = await getSchoolUrl(schoolCode)
  setServerUrl(serverURL)

  let schoolInfo = await fetchWithToken(serverURL + `schoolCode?schoolCode=${schoolCode}&language=slo`)
  await setSchoolInfo(schoolInfo)
  console.log(schoolInfo)

  return schoolInfo
}