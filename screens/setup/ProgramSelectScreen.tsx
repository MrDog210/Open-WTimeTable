import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { SchoolInfo } from "../../types/types";
import Text from "../../components/ui/Text";
import Container from "../../components/ui/Container";
import { Alert, StyleSheet, View } from "react-native";
import { useLayoutEffect, useState } from "react";
import { getBasicProgrammes } from "../../util/http/api";
import { truncateDatabase } from "../../util/store/database";
import { fetchAndInsertLectures, getAndSetAllDistinctBranchGroups } from "../../util/timetableUtils";
import { getSchoolYearDates } from "../../util/dateUtils";
import Button from "../../components/ui/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { FlatList } from "react-native-gesture-handler";
import ProgrammTreeRow, { TreeProgramme } from "../../components/programSelect/ProgrammTreeRow";
import { TreeYears } from "../../components/programSelect/YearTreeRow";
import ClassicProgramSelect from "../../components/programSelect/ClassicProgramSelect";
import Switch from "../../components/ui/Switch";

type ProgramSelectScreenProps = StaticScreenProps<{
  schoolInfo: SchoolInfo,
}>;

function generateYearsOfProgram(numOfYears: number): TreeYears[] {
  const years: TreeYears[] = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

  return years
}

function ProgramSelectScreen({route}: ProgramSelectScreenProps) {
  const { schoolInfo } = route.params
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const [chosenBranchesID, setChosenBranchesID] = useState<string[]>([])
  const [advancedMode, setAdvancedMode] = useState(false)

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [navigation, schoolInfo.schoolName])

  const { data: programms, ...basicProgrammesQuery} = useQuery<TreeProgramme[]>({
    initialData: [],
     queryFn: async () => {
      const data = await getBasicProgrammes(schoolInfo.schoolCode)
      return data.map(({id, name, year}): TreeProgramme => ({
        id,
        name,
        year, 
        years: generateYearsOfProgram(Number(year))
      }))
    },
    queryKey: [ 'basicProgrammes', { schoolCode: schoolInfo.schoolCode }]
  })

  const saveAndInsertData = useMutation({
    mutationFn: async () => {
      await truncateDatabase()

      console.log('Fetchig groups')
      const groups = await getAndSetAllDistinctBranchGroups(schoolInfo.schoolCode, chosenBranchesID!)
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

  const Title = <Text style={styles.title}>Select your branch or branches</Text>

  function switchMode(isAdvanced: boolean) {
    setChosenBranchesID([])
    setAdvancedMode(isAdvanced)
  }

  console.log(chosenBranchesID)
  const isFetching = basicProgrammesQuery.isFetching || saveAndInsertData.isPending
  // TODO: add toggle for advance mode or simple mode
  return (
    <>
      <LoadingOverlay visible={isFetching} text={fetchingDataMessage} />
      <Container >
        { advancedMode ? <FlatList key="advanced" contentContainerStyle={{paddingBottom: 100}} data={programms} 
        ListHeaderComponent={Title}
        renderItem={({item, index}) => <ProgrammTreeRow selectedBranches={chosenBranchesID} setSelectedBranches={setChosenBranchesID} 
        schoolCode={schoolInfo.schoolCode} programme={item} index={index} />} /> 
        : 
        <View style={{flex: 1}} key="classic">
          {Title}
          <ClassicProgramSelect chosenBranchesID={chosenBranchesID} setChosenBranchesID={setChosenBranchesID}
            programms={programms} schoolCode={schoolInfo.schoolCode} />
        </View>
        }
        <View style={styles.switchContainer}>
          <Text style={{alignSelf: 'center'}}>Advanced mode</Text>
          <Switch value={advancedMode} onValueChange={switchMode} />
        </View>
        <View style={{
          padding: 15,
          paddingTop: 0
        }}>
          <Button disabled={chosenBranchesID.length === 0} onPress={proceedToGroupSelect}>Proceed to group selection</Button>
        </View>
      </Container>
    </>
  )
}

export default ProgramSelectScreen

const styles = StyleSheet.create({
  title: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 20, 
    paddingVertical: 10,
  },
  switchContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 54,
    padding: 15
  },
})