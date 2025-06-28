import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';
import NextUpWidget from './NextUpWidget';
import { Lecture } from '../../types/types';

const EXAMPLE_LECTURE: Lecture = {
  "id": 101,
  "start_time": "2025-07-01T09:00:00Z",
  "end_time": "2025-07-01T10:30:00Z",
  "courseId": 201,
  "course": "Introduction to Artificial Intelligence",
  "eventType": "Lecture",
  "note": "Covers foundational concepts of AI and machine learning algorithms.",
  "executionTypeId": 1,
  "executionType": "On-Campus",
  "branches": [
    {
      "id": 501,
      "name": "Computer Science"
    }
  ],
  "rooms": [
    {
      "id": 301,
      "name": "Lecture Hall A",
    }
  ],
  "groups": [
    {
      "id": 401,
      "name": "CS-Year2-GroupA"
    },
    {
      "id": 402,
      "name": "CS-Year2-GroupB"
    }
  ],
  "lecturers": [
    {
      "id": 601,
      "name": "John Doe"
    }
  ],
  "showLink": "https://example.com/lecture/101",
  "color": "#4CAF50",
  "colorText": "#FFFFFF",
  course_id: 1,
  executionType_id: 1,
  usersNote: {
    courses_id: 1,
    executionType_id: 1,
    id: 1,
    note: 'Test note'
  }
}


function WidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <NextUpWidget lecture={EXAMPLE_LECTURE} />}
        width={320}
        height={200}
      />
    </View>
  );
}

export default WidgetPreviewScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});