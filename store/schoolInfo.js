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

export async function getUrlSchoolCode() {
  return await getKey('UrlSchoolCode')
}

export async function setUrlSchoolCode(value) {
  return setKey('UrlSchoolCode', value)
}

export async function getSchoolInfo() {
  const jsonString = await getKey('schoolInfo')
  return JSON.parse(jsonString)
}

export async function setSchoolInfo(value) {
  return setKey('schoolInfo', JSON.stringify(value))
}

export async function getServerUrl() {
  return await getKey('serverUrl')
}

export async function setServerUrl(value) {
  return setKey('serverUrl', value)
}

export async function getAllStoredBranchGroups() {
  const json = await getKey('groups')
  return JSON.parse(json)
}

export async function setAllBranchGroups(value) {
  return setKey('groups', JSON.stringify(value))
}

export async function getChosenBranch() {
  const json = await getKey('chosenBranch')
  return JSON.parse(json)
}

export async function setChosenBranch(value) {
  return setKey('chosenBranch', JSON.stringify(value))
}

/* schoolInfo = { // example
  firstDayOfWeek: 1,
  lastChangeDate: "19.01.2024 11:16",
  schoolCity: 'MARIBOR',
  schoolCode: 'wtt_um_feri',
  schoolName: 'UM FERI'
} */

/*
branch = {
  id: "10",
  branchName: "Nekaj"
}
*/