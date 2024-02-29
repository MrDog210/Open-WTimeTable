import { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from "@react-navigation/native";
import WeekStrip from "@mrdog210/react-native-week-strip";


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
      snapPoints={[120, 400]}>
      <BottomSheetView style={styles.contentContainer} focusable>
        {sheetPosition === 0 && <WeekStrip 
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-04-01')}
          date={date}
          onDateChange={setDate}
          allowSelectingFuture
          weekRowStyle
        /> }
        {sheetPosition === 1 && <CalendarPicker 
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