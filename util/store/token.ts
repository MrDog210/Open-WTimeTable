import { API_URL } from "../constants"
import { get } from "../http/http"
import Storage from 'expo-sqlite/kv-store';
import JWT from 'expo-jwt';

type FetchTokenResponse = {
  token: string
}

export async function fetchToken() {
  return get<FetchTokenResponse>(`${API_URL}login`)
}

async function storeToken(token: string) {
  return Storage.setItem('token', token)
}

export async function getToken() {
  let token = await Storage.getItem('token');

  if(token !== null) {
    console.log("saved jwt token")
    const jwtTokenValue = JWT.decode(token, '')
    console.log("decoded jwt token", jwtTokenValue)
    if(Date.now() < jwtTokenValue.exp! - 60000) // check if it expired
      return token
  }

  const newToken = (await fetchToken()).token
  storeToken(newToken)
  return token
}