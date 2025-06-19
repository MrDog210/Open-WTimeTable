import { Branch, GroupBranchMain, LectureWise, Programme, SchoolInfo } from "../../types/types"
import { API_URL } from "../constants"
import { getISODateNoTimestamp } from "../dateUtils"
import { getServerUrl, setServerUrl } from "../store/schoolData"
import { getWithToken } from "./http"

type FetchSchoolUrlResponse = {
  server: string
}

async function fetchSchoolUrl(userSchoolCode: string) {
  const json = await getWithToken<FetchSchoolUrlResponse>(`${API_URL}url?schoolCode=${userSchoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(userSchoolCode: string) {
  userSchoolCode = userSchoolCode.toLowerCase()

  const serverURL = await fetchSchoolUrl(userSchoolCode)
  setServerUrl(serverURL)

  return getWithToken<SchoolInfo>(`${serverURL}schoolCode?schoolCode=${userSchoolCode}&language=slo`)
}

// note from here, you must use the provided school code by the school info fetch function, not the user provided one

export async function getBasicProgrammes(schoolCode: string) {
  const url = await getServerUrl()

  return getWithToken<Programme[]>(`${url}basicProgrammeAll?schoolCode=${schoolCode}&language=slo`)
}

export async function fetchBranchesForProgramm(schoolCode: string, programmeId: string, year: string) {
  const url = await getServerUrl()

  return getWithToken<Branch[]>(`${url}branchAllForProgrmmeYear?schoolCode=${schoolCode}&language=slo&programmeId=${programmeId}&year=${year}`)
}

export async function fetchGroupsForBranch(schoolCode: string, branchId: string) {
  const url = await getServerUrl()

  return getWithToken<GroupBranchMain[]>(`${url}groupAllForBranch?schoolCode=${schoolCode}&language=slo&branchId=${branchId}`)
}

export async function fetchNotifications() { // ?????????
  const url = await getServerUrl()

  return getWithToken<string[]>(`${url}notificationByGroups?schoolCode=wtt_um_feri&language=slo&groupsId=87_231_640`)
}

// dates are INCLUSIVE
export async function fetchLecturesForGroups(schoolCode: string, groups: { id: number }[], startDate: Date, endDate: Date) {
  const url = await getServerUrl()                                                     

  let allGroupsId = ''

  groups.forEach(group => {
    allGroupsId += group.id.toString() + '_'
  });
  allGroupsId = allGroupsId.slice(0, -1);

  const startDateIso = getISODateNoTimestamp(startDate)
  const endDateIso = getISODateNoTimestamp(endDate)
  return getWithToken<LectureWise[]>(`${url}scheduleByGroups?schoolCode=${schoolCode}&dateFrom=${startDateIso}&dateTo=${endDateIso}&language=slo&groupsId=${allGroupsId}`)
}