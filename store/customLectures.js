import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCustomLectures() {
  const data = await AsyncStorage.getItem('customLectures')

  if(data)
    return JSON.parse(data)
  return []
}

export async function setCustomLectures(customLectures) {
  return AsyncStorage.setItem('customLectures', JSON.stringify(customLectures))
}