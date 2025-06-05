import Storage from 'expo-sqlite/kv-store';
import { Branch, Group, SchoolInfo } from '../../types/types';

export async function getUrlSchoolCode() {
  return Storage.getItem('UrlSchoolCode')
}

export async function setUrlSchoolCode(schoolCode: string) {
  return Storage.setItem('UrlSchoolCode', schoolCode)
}

export async function getSchoolInfo() {
  const jsonString = await Storage.getItem('schoolInfo')
  if(jsonString === null)
    throw new Error("schoolInfo is null!")
  return JSON.parse(jsonString) as SchoolInfo
}

export async function setSchoolInfo(schoolInfo: SchoolInfo) {
  return Storage.setItem('schoolInfo', JSON.stringify(schoolInfo))
}

export async function getServerUrl() {
  return Storage.getItem('serverUrl')
}

export async function setServerUrl(serverUrl: string) {
  return Storage.setItem('serverUrl', serverUrl)
}

export async function getAllStoredBranchGroups() {
  const json = await Storage.getItem('groups')
  if(json === null)
    throw new Error("groups is null!")
  return JSON.parse(json) as Group[]
}

export async function setAllBranchGroups(groups: Group[]) {
  return Storage.setItem('groups', JSON.stringify(groups))
}

export async function getChosenBranch() {
  const json = await Storage.getItem('chosenBranch')
  if(json === null)
    throw new Error("chosenBranch is null!")
  return JSON.parse(json) as Branch
}

export async function setChosenBranch(branch: Branch) {
  return Storage.setItem('chosenBranch', JSON.stringify(branch))
}