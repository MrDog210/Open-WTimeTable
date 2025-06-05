import { StaticScreenProps } from "@react-navigation/native";
import { SchoolInfo } from "../../types/types";
import Text from "../../components/ui/Text";

type ProgramSelectScreenProps = StaticScreenProps<{
  schoolInfo: SchoolInfo
}>;

function ProgramSelectScreen({route}: ProgramSelectScreenProps) {


  return (
    <Text>{JSON.stringify(route.params)}</Text>
  )
}

export default ProgramSelectScreen