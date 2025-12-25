import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native"
import facultiesData from './../../assets/data/FacultyCodes.json'
import { FacultyCode } from "../../types/types"
import Text  from './../ui/Text'
import { useTheme } from "../../context/ThemeContext"
import TextInput from "../ui/TextInput"
import { useMemo, useState } from "react"
import { University } from "lucide-react-native"
const faculties: FacultyCode[] = facultiesData as FacultyCode[]

export type SearchCodesModalProps = {
  open: boolean,
  setOpen: (isOpen: boolean, code?: string) => void
}

function SearchCodesModal({ open, setOpen }: SearchCodesModalProps) {
  const { colors } = useTheme()
  const [search, setSearch] = useState('')

  const facultiesFiltered = useMemo<FacultyCode[]>(() => {
    return faculties.filter(({inputCode, schoolCity, schoolName}) => `${schoolName}${schoolCity}${inputCode}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  }, [search])

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={() => setOpen(false)}
      >
        <View style={{backgroundColor: colors.background, flex: 1, padding: 15, paddingBottom: 0, gap: 10}}>
          <TextInput placeholder="Search" value={search} onChangeText={setSearch} />
          <FlatList
            contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
            data={facultiesFiltered}
            keyExtractor={({inputCode}) => inputCode}
            renderItem={({item}) => (
              <View
                style={[{backgroundColor: colors.surface}, styles.rowContainer]}
              >
                <Pressable style={styles.rowContainerPressable} android_ripple={{color: colors.touchColor }} onPress={() => {
                  setOpen(false, item.inputCode)
                }}>
                  <University color={colors.primary} size={28} />
                  <View style={{flex: 1}}>
                    <Text
                      style={[{color: colors.onSurface}, styles.rowText]}
                    >
                      {item.schoolName} - {item.schoolCity} ({item.inputCode})
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={styles.noResults}>
                  We might not have this code scraped :(
                </Text>
              </View>
            )} />
        </View>
      </Modal>
  )
}

export default SearchCodesModal

const styles = StyleSheet.create({
  rowContainer: {
    borderRadius: 15,
    marginVertical: 5,
    overflow: 'hidden'
  },
  rowContainerPressable: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  rowText: {
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 16,
  },
  noResults: {
    fontWeight: 'bold',
    fontSize: 19,
    textAlign: 'center'
  }
})