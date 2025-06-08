import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { Branch, Programme, SchoolInfo } from "../../types/types";
import Text from "../../components/ui/Text";
import Container from "../../components/ui/Container";
import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { fetchBranchesForProgramm, getBasicProgrammes } from "../../util/http/api";
import { setChosenBranch } from "../../util/store/schoolData";
import { truncateDatabase } from "../../util/store/databse";
import { fetchAndInsertLectures, getAndSetAllDistinctBranchGroups } from "../../util/timetableUtils";
import { getSchoolYearDates } from "../../util/dateUtils";
import Button from "../../components/ui/Button";
import DropDownPicker from "react-native-dropdown-picker";

type ProgramSelectScreenProps = StaticScreenProps<{
  schoolInfo: SchoolInfo
}>;

function generateYearsOfProgram(program: Programme) {
  const numOfYears = Number(program.year)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

    console.log(years)
  return years
}

function ProgramSelectScreen({route}: ProgramSelectScreenProps) {
  const { schoolInfo } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')

  const [programsOpen, setProgramsOpen] = useState(false)
  const [programms, setProgramms] = useState<Programme[]>([])
  const [chosenProgrammID, setChosenProgrammID] = useState<string | null>(null)

  const [yearopen, setYearOpen] = useState(false)
  const [years, setYears] = useState<{id: number; name: string}[]>([])
  const [chosenYear, setChosenYear] = useState<string | null>(null)

  const [branchOpen, setBranchOpen] = useState(false)
  const [branches, SetBranches] = useState<Branch[]>([])
  const [chosenBranchID, setChosenBranchID] = useState<string | null>(null)

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        setFetchingDataMessage('Fetching programs')
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
    if(!program) return
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
        setFetchingDataMessage('Fetching branches')
        setChosenBranchID(null)
        SetBranches(await fetchBranchesForProgramm(schoolInfo.schoolCode, chosenProgrammID!, chosenYear!))
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
      setIsFetchingData(false)
    }
    getBranches()
  }, [chosenYear])

  async function proceedToGroupSelect() {
    setIsFetchingData(true)
    setFetchingDataMessage('Fetching lectures')
    //const program = programms.find((item) => item.id === chosenProgrammID)
    const chosenBranch = branches.find(b => b.id == chosenBranchID)
    if(!chosenBranch) return
    setChosenBranch(chosenBranch) // we store the chosen branch, for future use
    try {
      truncateDatabase()
      console.log('Fetchig groups')

      const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, chosenBranchID!)

      setFetchingDataMessage('Inserting lectures into database, this WILL take a while')
      let {startDate, endDate} = getSchoolYearDates()
      console.log(startDate,endDate)
      await fetchAndInsertLectures(schoolInfo.schoolCode, groups, startDate, endDate)

      navigation.navigate('Setup', { screen: '', props: {isEditing: false} })
    } catch (error) {
      Alert.alert('Error', error.message)
    }
    setIsFetchingData(false)
  }

  return (
    <Container>

      <ScrollView style={styles.container}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Select your program, year and group</Text>
        <View>
          <DropDownPicker items={programms as any}
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
        </View>
        <View>
          {chosenProgrammID && <DropDownPicker items={years as any}
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
        {chosenYear && <DropDownPicker items={branches as any}
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
      </ScrollView>
      <View>
        <Button onPress={proceedToGroupSelect}>Proceed to group selection</Button>
      </View>
    </Container>
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