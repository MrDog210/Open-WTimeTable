import { useState } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"
import Text from "../ui/Text"
import { useMutation } from "@tanstack/react-query"
import { fetchBranchesForProgramm } from "../../util/http/api"
import { useTheme } from "../../context/ThemeContext"
import { Check } from "lucide-react-native"

export interface TreeYears {
  id: number
  name: string,
}

type YearTreeRowProps = {
  year: TreeYears,
  selectedBranches: string[],
  setSelectedBranches: (data: string[]) => void,
  index: number,
  data: {
    schoolCode: string,
    programmId: string
  }
}

function YearTreeRow({year, selectedBranches, setSelectedBranches, data, index}: YearTreeRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { colors } = useTheme()

  const {data: branches, ...getBranchesForProgrammMutation} = useMutation({
    mutationFn: () => {
      console.log('fetching')
      return fetchBranchesForProgramm(data.schoolCode, data.programmId, year.name)
    },
    mutationKey: [ 'branchesForProgamme', { schoolCode: data.schoolCode, programmId: data.programmId, year: year.name }],
  })

  function onYearPressed() {
    if(!isExpanded && !branches) {
      getBranchesForProgrammMutation.mutateAsync()
    }
    setIsExpanded(!isExpanded)
  }
  
  function onItemPressed(pressedId: string, isSelected: boolean) {
    if(isSelected) 
      setSelectedBranches(selectedBranches.filter(id => id !== pressedId))
    else 
      setSelectedBranches([...selectedBranches, pressedId])
  }

  return (
    <View style={{
      marginLeft: 20,
    }}>
      <Pressable onPress={onYearPressed} style={{
        backgroundColor: index % 2 !== 0 ? colors.surfaceVariant : undefined,
        minHeight: 50,
        justifyContent: 'center',
        paddingLeft: 10
      }}>
        <Text>Year {year.name}</Text>
      </Pressable>
      {
        isExpanded && !!branches ? branches.map((branch, index) => {
          const isSelected = selectedBranches.find((id) => id === branch.id)
          return (
            <Pressable onPress={() => onItemPressed(branch.id, !!isSelected)} key={branch.id} style={{
              marginLeft: 20,
              flexDirection: 'row',
              backgroundColor: index % 2 !== 0 ? colors.surfaceVariant : undefined,
              minHeight: 50,
              alignItems: 'center',
              paddingLeft: 5
            }}>
              { isSelected && <Check size={24} color={colors.onBackground} /> }
              <Text style={{ marginLeft: 5, fontWeight: isSelected ? 'bold' : undefined }}>{branch.branchName}</Text>
            </Pressable>
            )
          }) : undefined
      }
      {
        isExpanded && !branches ? <ActivityIndicator /> : undefined
      }
    </View>
  )
}

export default YearTreeRow