import { useEffect, useLayoutEffect, useState } from "react"
import { Text, View } from "react-native"
import { getBasicProgrammes } from "../../util/http"
import DropDownPicker from "react-native-dropdown-picker"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"


function generateYearsOfProgram(program) {
  const numOfYears = Number(program.year)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

    console.log(years)
  return years
}

function SelectGroupsScreen({route, navigation}) {
  const { schoolInfo } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [programms, setProgramms] = useState([])
  const [chosenProgrammID, setChosenProgrammID] = useState(null)

  const [yearopen, setYearOpen] = useState(false)
  const [years, setYears] = useState([])
  const [chosenYear, setChosenYear] = useState(null)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsFetchingData(true)
      const prog = await getBasicProgrammes(schoolInfo.schoolCode)
      setProgramms(prog)
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
    console.log(program)
  }, [chosenProgrammID])

  function proceedToGroupSelect() {

  }

  return (
    <View>
      <Spinner visible={isFetchingData} />
      <View>
        <Text>Program:</Text>
        <DropDownPicker items={programms}
          open={open}
          setOpen={setOpen}
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
        {chosenYear && <StyledButton onPress={proceedToGroupSelect} title='Proceed to group selection' />}
      </View>
    </View>
  )
}

export default SelectGroupsScreen