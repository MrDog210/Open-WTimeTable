import { Branch, GroupBranchChild, SchoolInfo } from '../../types/types';
import { storage } from '../constants';

export async function getUrlSchoolCode() {
  return storage.getItem('UrlSchoolCode')
}

export async function setUrlSchoolCode(schoolCode: string) {
  return storage.setItem('UrlSchoolCode', schoolCode)
}

export async function getSchoolInfo() {
  const jsonString = await storage.getItem('schoolInfo')
  if(!jsonString)
    throw new Error("schoolInfo is null!")
  return JSON.parse(jsonString) as SchoolInfo
}

export async function setSchoolInfo(schoolInfo: SchoolInfo) {
  return storage.setItem('schoolInfo', JSON.stringify(schoolInfo))
}

export async function getServerUrl() {
  return storage.getItem('serverUrl')
}

export async function setServerUrl(serverUrl: string) {
  return storage.setItem('serverUrl', serverUrl)
}

export async function getAllStoredBranchGroups() {
  const json = await storage.getItem('groups')
  if(!json)
    throw new Error("groups is null!")
  return JSON.parse(json) as GroupBranchChild[]
}

export async function setAllBranchGroups(groups: GroupBranchChild[]) {
  return storage.setItem('groups', JSON.stringify(groups))
}

export async function getChosenBranch() {
  const json = await storage.getItem('chosenBranch')
  if(!json)
    throw new Error("chosenBranch is null!")
  return JSON.parse(json) as Branch
}

export async function setChosenBranch(branch: Branch) {
  return storage.setItem('chosenBranch', JSON.stringify(branch))
}