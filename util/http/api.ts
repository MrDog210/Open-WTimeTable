import { Group } from "../../types/types"
import { API_URL } from "../constants"
import { getWithToken } from "./http"

async function fetchSchoolUrl(schoolCode: string) {
  let json = await getWithToken(API_URL + `url?schoolCode=${schoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(schoolCode: string) {
  schoolCode = schoolCode.toLowerCase()

  const serverURL = await fetchSchoolUrl(schoolCode)
  setServerUrl(serverURL)

  let schoolInfo = await getWithToken(serverURL + `schoolCode?schoolCode=${schoolCode}&language=slo`)

  return schoolInfo
}

export async function getBasicProgrammes(schoolCode: string) {
  const url = await getServerUrl()

  const json = await getWithToken(url + `basicProgrammeAll?schoolCode=${schoolCode}&language=slo`)

  return json
}

export async function fetchBranchesForProgramm(schoolCode: string, programmeId: number, year: number) {
  const url = await getServerUrl()

  const json = await getWithToken(url + `branchAllForProgrmmeYear?schoolCode=${schoolCode}&language=slo&programmeId=${programmeId}&year=${year}`)

  return json
}

export async function fetchGroupsForBranch(schoolCode: string, branchId: number) {
  const url = await getServerUrl()

  const json = await getWithToken(url + `groupAllForBranch?schoolCode=${schoolCode}&language=slo&branchId=${branchId}`)

  return json
}

export async function fetchNotifications() { // ?????????
  const url = await getServerUrl()

  const json = await getWithToken(url + `notificationByGroups?schoolCode=wtt_um_feri&language=slo&groupsId=87_231_640`)
  //console.log(JSON.stringify(json, null, '\t'));

  return json
}

export async function fetchLecturesForGroups(schoolCode: string, groups: Group[], startDate: Date, endDate: Date) { // groups is array { id, name }
  const url = await getServerUrl()                                                     // also it seems to be inclusive of dates

  let allGroupsId = ''
  
  groups.forEach(group => {
    allGroupsId += group.id.toString() + '_'
  });
  allGroupsId = allGroupsId.slice(0, -1);

  startDate = getISODateNoTimestamp(startDate)
  endDate = getISODateNoTimestamp(endDate)
  const json = await getWithToken(url + `scheduleByGroups?schoolCode=${schoolCode}&dateFrom=${startDate}&dateTo=${endDate}&language=slo&groupsId=${allGroupsId}`)

  return json
}