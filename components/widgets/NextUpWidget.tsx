import { FlexWidget, TextWidget, ColorProp } from "react-native-android-widget"
import { Lecture } from "../../types/types"
import { formatArray } from "../../util/timetableUtils";
import { getTimeFromDate } from "../../util/dateUtils";

type NextUpWidgetProps = {
  lecture?: Lecture
}

type UniversalColorMap = {
  [key: string]: ColorProp;
};

const colors: UniversalColorMap = {
  primary: "#eb3b5aff",
  onPrimary: "#ffffffff",
  background: "#2c2c2eff",
  onBackground: "#ffffffff",
}

function NextUpWidget({ lecture }: NextUpWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: colors.primary,
        borderRadius: 15,
      }}
    >
      { lecture ? (
        <FlexWidget style={{flex: 1, width: 'match_parent', height: 'match_parent'}}>
          <TextWidget
            text="Now"
            style={{
              fontSize: 18,
              color: colors.onPrimary,
              padding: 10
            }}
          />
          <FlexWidget style={{
            flex: 1,
            backgroundColor: colors.background,
            width: 'match_parent',
            padding: 10
          }}>
            <TextWidget
              text={lecture.course}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.onPrimary,
              }}
            />
            <TextWidget
              text={`${getTimeFromDate(lecture.start_time)} - ${getTimeFromDate(lecture.end_time)}`}
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: colors.onPrimary,
              }}
            />
            <TextWidget
              text={formatArray(lecture.rooms, 'name')}
              style={{
                fontSize: 16,
                color: colors.onPrimary,
              }}
            />
            <TextWidget
              text={formatArray(lecture.lecturers, 'name')}
              style={{
                fontSize: 16,
                color: colors.onPrimary,
              }}
            />
          </FlexWidget>
        </FlexWidget>
      ) : (
          <TextWidget
            text="NO LECTURE"
            style={{
              fontSize: 30,
              color: colors.onBackground,
            }}
          />
        )
      }
      
    </FlexWidget>
  )
}

export default NextUpWidget