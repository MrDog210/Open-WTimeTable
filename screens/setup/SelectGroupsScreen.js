import { useEffect, useLayoutEffect, useState } from "react"
import { Text, View } from "react-native"
import { getBasicProgrammes } from "../../util/http"
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons } from '@expo/vector-icons'

function generateYearsOfProgram(program) {
  const numOfYears = Number(program.year)
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})
  return years
}

var year

function SelectGroupsScreen({route, navigation}) {
  const { schoolInfo } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [programms, setProgramms] = useState([])
  const [chosenProgramm, setChosenProgramm] = useState([])
  const [chosenYear, setChosenYear] = useState([])

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

  function onSelectedProgram(id) {
    const program = programms.find((item) => item.id === id[0])
    setChosenProgramm([program])
    years = generateYearsOfProgram(program)
    console.log(program)
  }

  function onSelectedYear(year) {
    console.log(year[0])
  }

  return (
    <View>
      <View>
        <Text>Program:</Text>
        <SectionedMultiSelect IconRenderer={MaterialIcons} hideSearch={true}
          items={programms}
          uniqueKey='id'
          onSelectedItemsChange={onSelectedProgram}
          selectText="Please choose your program"
          single={true}
          hideConfirm={true}
          modalAnimationType='slide'
          showChips={true}
          selectedItems={chosenProgramm}
        />
        <Text>{chosenProgramm?.name}</Text>
      </View>
      <View>
        {chosenProgramm && <SectionedMultiSelect IconRenderer={MaterialIcons} hideSearch={true}
          items={years}
          onSelectedItemsChange={onSelectedYear}
          uniqueKey='id'
          selectText="Please choose your program"
          showDropDowns={true}
          single={true}
          hideConfirm={true}
          modalAnimationType='slide'
          showChips={true}
          //selectedItems={chosenYear}
        />}
      </View>
    </View>
  )
}


export default SelectGroupsScreen