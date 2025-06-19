import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { Programme, SchoolInfo } from "../../types/types";
import Text from "../../components/ui/Text";
import Container from "../../components/ui/Container";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useLayoutEffect, useState } from "react";
import { fetchBranchesForProgramm, getBasicProgrammes } from "../../util/http/api";
import { setChosenBranch } from "../../util/store/schoolData";
import { truncateDatabase } from "../../util/store/database";
import { fetchAndInsertLectures, getAndSetAllDistinctBranchGroups } from "../../util/timetableUtils";
import { getSchoolYearDates } from "../../util/dateUtils";
import Button from "../../components/ui/Button";
import DropDownPicker from "../../components/ui/DropDownPicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

type ProgramSelectScreenProps = StaticScreenProps<{
  schoolInfo: SchoolInfo
}>;

function generateYearsOfProgram(program: Programme) {
  const numOfYears = Number(program.year)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

  return years
}

function ProgramSelectScreen({route}: ProgramSelectScreenProps) {
  const { schoolInfo } = route.params
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')

  const [programsOpen, setProgramsOpen] = useState(false)
  const [chosenProgrammID, setChosenProgrammID] = useState<string | null>(null)

  const [yearOpen, setYearOpen] = useState(false)
  const [years, setYears] = useState<{id: number; name: string}[]>([])
  const [chosenYear, setChosenYear] = useState<string | null>(null)

  const [branchOpen, setBranchOpen] = useState(false)
  const [chosenBranchID, setChosenBranchID] = useState<string | null>(null)

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  })

  const { data: programms, ...basicProgrammesQuery} = useQuery({
    queryFn: () => getBasicProgrammes(schoolInfo.schoolCode),
    queryKey: [ 'basicProgrammes', { schoolCode: schoolInfo.schoolCode }]
  })

  const { data: branches} = useQuery({
    queryFn: () => {
      setChosenBranchID(null)
      return fetchBranchesForProgramm(schoolInfo.schoolCode, chosenProgrammID!, chosenYear!)
    },
    queryKey: [ 'branchesForProgamme', { schoolCode: schoolInfo.schoolCode, chosenProgrammID, chosenYear }],
    enabled: !!chosenProgrammID && !!chosenYear
  })

  function onProgrammIdSelected(id: string | null) {
    if(!id || !programms)
      return
    const program = programms.find((item) => item.id === id)
    if(!program) return
    setYears(generateYearsOfProgram(program))
    setChosenYear(null)
    setChosenBranchID(null)
  }

  const saveAndInsertData = useMutation({
    mutationFn: async () => {
      const chosenBranch = branches!.find(b => b.id === chosenBranchID)
      if(!chosenBranch) return
      await setChosenBranch(chosenBranch) // we store the chosen branch, for future use
      await truncateDatabase()

      console.log('Fetchig groups')
      const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, chosenBranchID!)
      setFetchingDataMessage('Inserting lectures into database, this WILL take a while')
      let {startDate, endDate} = getSchoolYearDates()
      console.log(startDate,endDate)
      await fetchAndInsertLectures(schoolInfo.schoolCode, groups, startDate, endDate)
    },
  })

  async function proceedToGroupSelect() {
    setFetchingDataMessage('Fetching lectures')
    try {
      await saveAndInsertData.mutateAsync()
      navigation.navigate('Setup', { screen: 'GroupSelect', params: { isEditing: false} })
    } catch (error) {
      if(error instanceof Error) {
        Alert.alert('Error', error.message)
        console.error(error.message)
      }
    }
  }

  const isFetching = basicProgrammesQuery.isFetching || saveAndInsertData.isPending

  return (
    <>
    <LoadingOverlay visible={isFetching} text={fetchingDataMessage} />
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{ gap: 15 }}>
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
            onChangeValue={onProgrammIdSelected}
            zIndex={3000}
            placeholder="Select program"
          />
        </View>
        <View>
          {chosenProgrammID && <DropDownPicker items={years as any}
            open={yearOpen}
            setOpen={setYearOpen}
            value={chosenYear}
            setValue={(a) => {setChosenBranchID(null);setChosenYear(a)}}
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
        <Button disabled={!chosenBranchID} onPress={proceedToGroupSelect}>Proceed to group selection</Button>
      </View>
    </Container>
    </>
  )
}

export default ProgramSelectScreen

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 0
  },
})