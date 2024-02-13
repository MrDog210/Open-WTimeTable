import { useEffect, useLayoutEffect, useState } from "react"
import { Alert, Text, View } from "react-native"
import { fetchBranchesForProgramm, fetchGroupsForBranch, getBasicProgrammes } from "../../util/http"
import DropDownPicker from "react-native-dropdown-picker"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"
import { fillUpDatabase } from "../../util/timetableUtils"
import { getAllUniqueGroups } from "../../util/groupUtil"


function generateYearsOfProgram(program) {
  const numOfYears = Number(program.year)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

    console.log(years)
  return years
}

function ProgramSelectScreen({route, navigation}) {
  const { schoolInfo } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)

  const [programsOpen, setProgramsOpen] = useState(false)
  const [programms, setProgramms] = useState([])
  const [chosenProgrammID, setChosenProgrammID] = useState(null)

  const [yearopen, setYearOpen] = useState(false)
  const [years, setYears] = useState([])
  const [chosenYear, setChosenYear] = useState(null)

  const [branchOpen, setBranchOpen] = useState(false)
  const [branches, SetBranches] = useState([])
  const [chosenBranchID, setChosenBranchID] = useState(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        const prog = await getBasicProgrammes(schoolInfo.schoolCode)
        setProgramms(prog)
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
      setIsFetchingData(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if(chosenProgrammID === null)
      return
    console.log(chosenProgrammID)
    const program = programms.find((item) => item.id === chosenProgrammID)
    setYears(generateYearsOfProgram(program))
    setChosenYear(null)
    setChosenBranchID(null)
    console.log(program)
  }, [chosenProgrammID])

  useEffect(() => {
    if(chosenYear === null){
      SetBranches([])
      return
    }
    async function getBranches() {
      try {
        setIsFetchingData(true)
        setChosenBranchID(null)
        SetBranches(await fetchBranchesForProgramm(schoolInfo.schoolCode, chosenProgrammID, chosenYear))
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
      setIsFetchingData(false)
    }
    getBranches()
  }, [chosenYear])

  async function proceedToGroupSelect() {
    setIsFetchingData(true)
    const program = programms.find((item) => item.id === chosenProgrammID)
    try {
      const groups = getAllUniqueGroups(await fetchGroupsForBranch(schoolInfo.schoolCode, chosenBranchID))
      await fillUpDatabase(schoolInfo.schoolCode, groups)
    } catch (error) {
      Alert.alert('Error', error.message)
    }
    navigation.navigate('SelectGroups', {
      schoolInfo: schoolInfo,
      chosenProgramm: program,
      chosenYear: chosenYear,
      branchId: chosenBranchID
    })
    setIsFetchingData(false)
  }

  return (
    <View>
      <Spinner visible={isFetchingData} />
      <View>
        <Text>Program:</Text>
        <DropDownPicker items={programms}
          open={programsOpen}
          setOpen={setProgramsOpen}
          value={chosenProgrammID}
          setValue={setChosenProgrammID}
          schema={{
            label: 'name',
            value: 'id'
          }}
          zIndex={3000}
          placeholder="Select program"
        />
        <Text>{chosenProgrammID?.name}</Text>
      </View>
      <View>
        {chosenProgrammID && <DropDownPicker items={years}
          open={yearopen}
          setOpen={setYearOpen}
          value={chosenYear}
          setValue={setChosenYear}
          schema={{
            label: 'name',
            value: 'id'
          }}
          zIndex={2000}
          placeholder="Select year"
        />}
      </View>
      <View>
      {chosenYear && <DropDownPicker items={branches}
          open={branchOpen}
          setOpen={setBranchOpen}
          value={chosenBranchID}
          setValue={setChosenBranchID}
          schema={{
            label: 'branchName',
            value: 'id'
          }}
          zIndex={1000}
          placeholder="Select branch"
        />}
      </View>
      <View>
        {chosenBranchID && <StyledButton onPress={proceedToGroupSelect} title='Proceed to group selection' />}
      </View>
    </View>
  )
}

export default ProgramSelectScreen