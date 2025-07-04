import { getToken } from "../store/token";
import NetInfo from '@react-native-community/netinfo';

export async function get<T>(url: string, token?: string) {
  const headers = token ? {
    Authorization: `Bearer ${token}`,
  } : undefined

  const response = await fetch(url, {
    headers:  headers
  });

  if(!response.ok) {
    console.log(JSON.stringify(response))
    throw new Error('Failed to fetch data')
  }

  return (await response.json()) as T
}

export async function getWithToken<T>(url: string) {
  const token = await getToken();
  return get<T>(url, token)
}

export async function hasInternetConnection() {
  return NetInfo.fetch().then(state => {
    return state.isConnected
  });
}