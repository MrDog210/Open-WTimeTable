import { Pressable, View } from "react-native"
import { Programme } from "../../types/types"
import { useState } from "react"
import Text from "../ui/Text"
import YearTreeRow, { TreeYears } from "./YearTreeRow"
import { useTheme } from "../../context/ThemeContext"

export interface TreeProgramme extends Programme {
  years: TreeYears[]
}

type ProgrammTreeRowProps = {
  programme: TreeProgramme
  selectedBranches: string[],
  setSelectedBranches: (data: string[]) => void,
  schoolCode: string,
  index: number
}

function ProgrammTreeRow({programme, selectedBranches, setSelectedBranches, schoolCode, index}: ProgrammTreeRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { colors } = useTheme()

  return (
    <View>
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={{
        backgroundColor: index % 2 === 0 ? colors.surfaceVariant : undefined,
        minHeight: 50,
        justifyContent: 'center',
        paddingHorizontal: 10
      }}>
        <Text>{programme.name}</Text>
      </Pressable>
      {
        isExpanded ? programme.years.map((year, index) => <YearTreeRow index={index} key={year.id} year={year} 
          selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} 
          data={{ schoolCode, programmId: programme.id}} /> ) : undefined
      }
    </View>
  )
}

export default ProgrammTreeRow