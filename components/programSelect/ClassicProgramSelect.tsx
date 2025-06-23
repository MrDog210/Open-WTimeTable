import { ScrollView, StyleSheet } from "react-native"
import { Programme } from "../../types/types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchBranchesForProgramm } from "../../util/http/api"
import DropDownPicker from "../ui/DropDownPicker"

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
  const [programsOpen, setProgramsOpen] = useState(false)
  const [chosenProgrammID, setChosenProgrammID] = useState<string | null>(null)

  const [yearOpen, setYearOpen] = useState(false)
  const [years, setYears] = useState<{id: number; name: string}[]>([])
  const [chosenYear, setChosenYear] = useState<string | null>(null)

  const [branchOpen, setBranchOpen] = useState(false)

  const { data: branches} = useQuery({
    initialData: [],
    queryFn: () => {
      //if(!multipleGroupSelect) setChosenBranchesID([])
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
    //if(!multipleGroupSelect) setChosenBranchesID([])
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 15 }}>
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
      <DropDownPicker items={years as any}
        open={yearOpen}
        setOpen={setYearOpen}
        value={chosenYear}
        setValue={setChosenYear}
        disabled={!chosenProgrammID}
        schema={{
          label: 'name',
          value: 'id'
        }}
        zIndex={2000}
        placeholder="Select year"
      />
      <DropDownPicker items={branches as any}
        open={branchOpen}
        setOpen={setBranchOpen}
        value={chosenBranchesID}
        setValue={setChosenBranchesID as any}
        schema={{
          label: 'branchName',
          value: 'id'
        }}
        disabled={!chosenYear}
        mode="BADGE"
        multiple
        //max={multipleGroupSelect ? 999 : 1}
        zIndex={1000}
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