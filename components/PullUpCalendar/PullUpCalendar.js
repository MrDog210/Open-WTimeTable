import { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from "@react-navigation/native";

function PullUpCalendar({date, setDate}) {
  const [sheetPosition, setSheetPosition] = useState(0)
  // ref
  const bottomSheetRef = useRef(null);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    setSheetPosition(index)
  }, []);

  function onCalanderDateSelected(date) {
    setDate(date)
    bottomSheetRef?.current.snapToIndex(0)
  }

  return (
    <BottomSheet 
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={[150, 500]}>
      <BottomSheetView style={styles.contentContainer} focusable>
        
        {sheetPosition === 1 &&<CalendarPicker 
          initialDate={date}
          selectedStartDate={date}
          onDateChange={onCalanderDateSelected}

          startFromMonday
          showDayStragglers
        />}
      </BottomSheetView>
    </BottomSheet>
  )
}

export default PullUpCalendar

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});