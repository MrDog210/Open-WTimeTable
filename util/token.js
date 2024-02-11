import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchToken } from './http';

const TOKEN_NAME = 'token'

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