import AsyncStorage from '@react-native-async-storage/async-storage';
import { USERNAME, PASSWORD } from "../constants/loginCredentials.js";
import { encode } from "base-64";
import { URL } from '../constants/http.js'
import ky from 'ky';

const TOKEN_NAME = 'token'

function handleError(error) {
  console.log(error)

  throw new Error(error)
}

async function fetchToken() {
  let json = await ky.get(URL + 'login', {
    headers: new Headers ({
      'Authorization': 'Basic ' + encode(`${USERNAME}:${PASSWORD}`), 
      'Content-Type': 'application/json'
  })}).json().catch(handleError)

  return json.token
}

export async function storeToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_NAME, token);
  } catch (error) {
    console.log(error)
  }
}

export async function getToken() {
  try {
    const value = await AsyncStorage.getItem(TOKEN_NAME);

    if(value !== null && value !== '') // token exists
      return value

    const token = await fetchToken()
    await storeToken(token)
    return token
  } catch (error) {
    console.log(error)
  }

  return null
}