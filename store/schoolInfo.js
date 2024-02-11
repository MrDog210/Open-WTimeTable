import AsyncStorage from "@react-native-async-storage/async-storage";

async function setKey(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error)
  }
}

async function getKey(key) {
  try {
    const value = await AsyncStorage.getItem(key);

    if(value !== null && value !== '') // token exists
      return value
  } catch (error) {
    console.log(error)
  }

  return null
}

export async function getSchoolInfo() {
  const jsonString = await getKey('schoolInfo')
  return JSON.parse(jsonString)
}

export async function setSchoolInfo(value) {
  await setKey('schoolInfo', value.toString())
}

export async function getServerUrl() {
  return await getKey('serverUrl')
}

export async function setServerUrl(value) {
  await setKey('serverUrl', value)
}

/* schoolInfo = { // example
  firstDayOfWeek: 1,
  lastChangeDate: "19.01.2024 11:16",
  schoolCity: 'MARIBOR',
  schoolCode: 'wtt_um_feri',
  schoolName: 'UM FERI'
} */