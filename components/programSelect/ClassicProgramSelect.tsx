import { ScrollView, StyleSheet } from "react-native"
import { Programme } from "../../types/types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchBranchesForProgramm } from "../../util/http/api"
import NewDropDownPicker from "../ui/NewDropDownPicker"

type ClassicProgramSelectProps = {
  programms: Programme[],
  schoolCode: string,
  chosenBranchesID: string[],
  setChosenBranchesID: (data: string[]) => void
}

function generateYearsOfProgram(numOfYears: number) {
  const years = []
  for(let i = 1; i <= numOfYears; i++)
    years.push({id: i, name: i.toString()})

  return years
}

function ClassicProgramSelect({ programms, schoolCode, chosenBranchesID, setChosenBranchesID }: ClassicProgramSelectProps) {
  const [chosenProgrammID, setChosenProgrammID] = useState<string | null>(null)
  const [years, setYears] = useState<{id: number; name: string}[]>([])
  const [chosenYear, setChosenYear] = useState<string | null>(null)

  const { data: branches} = useQuery({
    initialData: [],
    queryFn: () => {
      setChosenBranchesID([])
      return fetchBranchesForProgramm(schoolCode, chosenProgrammID!, chosenYear!)
    },
    queryKey: [ 'branchesForProgamme', { schoolCode, chosenProgrammID, chosenYear }],
    enabled: !!chosenProgrammID && !!chosenYear
  })

  function onProgrammIdSelected(id: string | null) {
    if(!id || !programms)
      return
    const program = programms.find((item) => item.id === id)
    if(!program) return
    setYears(generateYearsOfProgram(Number(program.year)))
    setChosenYear(null)
    setChosenBranchesID([])
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 15 }}>
      <NewDropDownPicker items={programms as any}
        value={chosenProgrammID}
        setValue={setChosenProgrammID}
        schema={{
          label: 'name',
          value: 'id'
        }}
        onChangeValue={onProgrammIdSelected}
        title="Program"
        placeholder="Select program"
      />
      <NewDropDownPicker items={years as any}
        value={chosenYear}
        setValue={setChosenYear}
        disabled={!chosenProgrammID}
        schema={{
          label: 'name',
          value: 'id'
        }}
        title="Year"
        placeholder="Select year"
      />
      <NewDropDownPicker items={branches as any}
        value={chosenBranchesID}
        setValue={setChosenBranchesID as any}
        schema={{
          label: 'branchName',
          value: 'id'
        }}
        disabled={!chosenYear}
        multiple
        //max={multipleGroupSelect ? 999 : 1}
        title="Branch"
        placeholder="Select branch"
      />
    </ScrollView>
  )
}

export default ClassicProgramSelect

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  }
})