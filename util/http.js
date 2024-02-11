import ky from "ky";
import { USERNAME, PASSWORD } from "../constants/loginCredentials.js";
import { encode } from "base-64";
import { getToken } from "./token.js";

const URL = 'https://wise-tt.com/WTTWebRestAPI/ws/rest/'

function handleError(error) {
  console.log(error)
}

export async function fetchToken() {
  let json = await ky.get(URL + 'login', {
    headers: new Headers ({
      'Authorization': 'Basic ' + encode(`${USERNAME}:${PASSWORD}`), 
      'Content-Type': 'application/json'
  })}).json().catch(handleError)

  return json.token
}

export async function getSchool(schoolCode) {
  schoolCode = schoolCode.toLowerCase()
  const token = await getToken()
  console.log(token)

  let json = await ky.get('https://www.wise-tt.com/WTTWebRestAPI/ws/rest/schoolCode?' + `schoolCode=${schoolCode}&language=slo`, {
    headers: new Headers ({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
  })}).json().catch(handleError)

  console.log(json)
  return json
}