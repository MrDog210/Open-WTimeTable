import { useEffect, useLayoutEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { fetchBranchesForProgramm, fetchGroupsForBranch, getBasicProgrammes } from "../../util/http"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"
import { fillUpDatabase } from "../../util/timetableUtils"
import { getAllUniqueGroups } from "../../util/groupUtil"
import { truncateDatabase } from "../../util/database"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import DropDownWithTitle from "../../components/ui/DropDownWithTitle"
import Title from "../../components/ui/Title"
import Line from "../../components/ui/Line"
import { setAllBranchGroups } from "../../store/schoolInfo"


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
    const program = programms.find((item) => item.id === chosenProgrammID)
    setYears(generateYearsOfProgram(program))
    setChosenYear(null)
    setChosenBranchID(null)
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
      truncateDatabase()
      console.log('Fetchig groups')
      const groups = getAllUniqueGroups(await fetchGroupsForBranch(schoolInfo.schoolCode, chosenBranchID))
      setAllBranchGroups(groups)
      await fillUpDatabase(schoolInfo.schoolCode, groups)
      navigation.navigate('SelectGroups', { isEditing: false })
    } catch (error) {
      Alert.alert('Error', error.message)
    }
    setIsFetchingData(false)
  }

  return (
    <>
    <Spinner visible={isFetchingData} {...SPINNER_STYLE} />
    <ScrollView style={styles.container}>
      <Title>Select your program, year and group</Title>
      <Line />
      <View>
        <DropDownWithTitle items={programms}
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
          title='Program'
        />
      </View>
      <View>
        {chosenProgrammID && <DropDownWithTitle items={years}
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
          title='Year'
        />}
      </View>
      <View>
      {chosenYear && <DropDownWithTitle items={branches}
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
          title='Branch'
        />}
      </View>
    </ScrollView>
    <View>
      {chosenBranchID && <StyledButton onPress={proceedToGroupSelect} title='Proceed to group selection' />}
    </View>
    </>
  )
}

export default ProgramSelectScreen

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
    flex: 1
  },
})