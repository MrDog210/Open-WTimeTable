
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

export async function setSchoolInfo() {
  return await getKey('schoolInfo')
}

export async function getSchoolInfo(value) {
  await setKey('schoolInfo', value)
}

/* schoolInfo = { // example
  firstDayOfWeek: 1,
  lastChangeDate: "19.01.2024 11:16",
  schoolCity: 'MARIBOR',
  schoolCode: 'wtt_um_feri',
  schoolName: 'UM FERI'
} */