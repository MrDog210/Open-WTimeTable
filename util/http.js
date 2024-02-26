import ky from "ky";
import { fetchToken, getToken, storeToken } from "./token.js";
import { getServerUrl, setServerUrl } from "../store/schoolInfo.js";
import { URL } from '../constants/http.js'
import { getISODateNoTimestamp } from "./dateUtils.js";
import NetInfo from '@react-native-community/netinfo';

function handleError(error) {
  console.log(error)

  throw new Error(error)
}

async function fetchWithToken(url, numOfRetries = 0) {
  const token = await getToken()

  const json = await ky.get(url, {
    headers: new Headers ({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    }),
    /*retry: {
      limit: 2,
      methods: ['get'],
      statusCodes: [401],
      backoffLimit: 5000
    },
    hooks: {
      beforeRetry: [
        async ({request, options, error, retryCount}) => {
          console.log('AAAAA')
          console.log(error, retryCount)
          //const token = await ky('https://example.com/refresh-token');
				  //request.headers.set('Authorization', `token ${token}`);
        }
      ]
    } */
  }).json().catch(async error => { // stupid
    if(numOfRetries === 0 && error.message.includes('401')) {
      const newToken = await fetchToken()
      await storeToken(newToken)
      return fetchWithToken(url, numOfRetries + 1)
    } else {
      handleError(error)
    }
  })

  return json
}

async function fetchSchoolUrl(schoolCode) {
  let json = await fetchWithToken(URL + `url?schoolCode=${schoolCode}&language=slo`)
  return json.server.replace('http://', 'https://') // FUNNY WISE
}

export async function getSchoolInfo(schoolCode) {
  schoolCode = schoolCode.toLowerCase()

  const serverURL = await fetchSchoolUrl(schoolCode)
  setServerUrl(serverURL)

  let schoolInfo = await fetchWithToken(serverURL + `schoolCode?schoolCode=${schoolCode}&language=slo`)

  return schoolInfo
}

export async function getBasicProgrammes(schoolCode) {
  const url = await getServerUrl()

  const json = await fetchWithToken(url + `basicProgrammeAll?schoolCode=${schoolCode}&language=slo`)

  return json
}

export async function fetchBranchesForProgramm(schoolCode, programmeId, year) {
  const url = await getServerUrl()

  const json = await fetchWithToken(url + `branchAllForProgrmmeYear?schoolCode=${schoolCode}&language=slo&programmeId=${programmeId}&year=${year}`)

  return json
}

export async function fetchGroupsForBranch(schoolCode, branchId) {
  const url = await getServerUrl()

  const json = await fetchWithToken(url + `groupAllForBranch?schoolCode=${schoolCode}&language=slo&branchId=${branchId}`)

  return json
}

export async function fetchNotifications() { // ?????????
  const url = await getServerUrl()

  const json = await fetchWithToken(url + `notificationByGroups?schoolCode=wtt_um_feri&language=slo&groupsId=87_231_640`)
  //console.log(JSON.stringify(json, null, '\t'));

  return json
}

export async function fetchLecturesForGroups(schoolCode, groups, startDate, endDate) { // groups is array { id, name }
  const url = await getServerUrl()                                                     // also it seems to be inclusive of dates

  let allGroupsId = ''
  
  groups.forEach(group => {
    allGroupsId += group.id.toString() + '_'
  });
  allGroupsId = allGroupsId.slice(0, -1);

  startDate = getISODateNoTimestamp(startDate)
  endDate = getISODateNoTimestamp(endDate)
  const json = await fetchWithToken(url + `scheduleByGroups?schoolCode=${schoolCode}&dateFrom=${startDate}&dateTo=${endDate}&language=slo&groupsId=${allGroupsId}`)
  //console.log(json)
  //console.log(JSON.stringify(json, null, '\t'));

  return json
}

export async function hasInternetConnection() {
  return NetInfo.fetch().then(state => {
    //console.log('Connection type', state.type);
    //console.log('Is connected?', state.isConnected);
    return state.isConnected
  });
  
}

/*const basicPrograms = [
  {
    id: 1,
    name: 'ŠTRUMAR BU',
    year: 1
  },
  {
    id: 2,
    name: 'RIT',
    year: 2
  }
]*/