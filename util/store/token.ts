import { API_URL, PASSWORD, USERNAME } from "../constants"
import { Storage } from '@op-engineering/op-sqlite';
import { encode, decode } from "base-64";

const storage = new Storage({})

type FetchTokenResponse = {
  token: string
}

export async function fetchToken() {
  const response = await fetch(`${API_URL}login`, {
    headers:  {
      'Authorization': 'Basic ' + encode(`${USERNAME}:${PASSWORD}`), 
    }
  });

  if(!response.ok) {
    console.log(JSON.stringify(response))
    throw new Error('Failed to fetch data')
  }

  const json = (await response.json()) as FetchTokenResponse

  return json.token
}

async function storeToken(token: string) {
  return storage.setItem('token', token)
}

export async function getToken() {
  let token = await storage.getItem('token');

  if(token) {
    const base64Strings = token.split('.')
    const payload = JSON.parse(decode(base64Strings[1])) as any as { exp: number}
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if(nowInSeconds < payload.exp - 60) // check if it expired
      return token
    console.log("TOKEN HAS EXPIRED!")
  }

  const newToken = await fetchToken()
  storeToken(newToken)
  return newToken
}