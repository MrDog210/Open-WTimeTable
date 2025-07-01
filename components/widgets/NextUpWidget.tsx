import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget"
import { Lecture } from "../../types/types"
import { formatArray } from "../../util/timetableUtils";
import { formatDate, getTimeFromDate } from "../../util/dateUtils";
import { WIDGET_COLORS as colors } from "../../util/constants";

type NextUpWidgetProps = {
  lecture?: Lecture,
  isNextUp: boolean
}

function NextUpWidget({ lecture, isNextUp }: NextUpWidgetProps) {
  return (
    <FlexWidget
      clickAction="REFRESH"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: colors.primary,
        borderRadius: 15,
        justifyContent: !lecture ? 'center' : undefined,
        alignItems: !lecture ? 'center' : undefined
      }}
    >
      { lecture ? (
        <FlexWidget style={{flex: 1, width: 'match_parent', height: 'match_parent'}}>
          <FlexWidget style={{ 
            flexDirection: 'row',
              width: 'match_parent',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <FlexWidget style={{flex: 1}}>
              <TextWidget
                text={isNextUp ? "Next" : "Now"}
                style={{
                  fontSize: 16,
                  color: colors.onPrimary,
                  padding: 10,
                  fontWeight: 'bold'
                }}
              />
            </FlexWidget>
            <SvgWidget
              svg={require('../../assets/widget/refresh.svg')}
              style={{
                borderColor: colors.primary,
                width: 28,
                height: 38,
                marginRight: 10
              }}
            />
          </FlexWidget>
          <FlexWidget style={{
            flex: 1,
            backgroundColor: colors.background,
            width: 'match_parent',
            padding: 10,
            paddingBottom: 0
          }}>
            <TextWidget
              text={`${lecture.course} - ${lecture.executionType}`}
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.onPrimary,
              }}
            />
            <TextWidget
              text={`${getTimeFromDate(lecture.start_time)} - ${getTimeFromDate(lecture.end_time)}`}
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: colors.onPrimary,
              }}
            />
            { isNextUp && <TextWidget
              text={formatDate(lecture.start_time)}
              style={{
                fontSize: 14,
                textAlign: 'center',
                color: colors.onPrimary,
              }}
            />}
            <TextWidget
              text={formatArray(lecture.rooms, 'name')}
              style={{
                fontSize: 14,
                color: colors.onPrimary,
              }}
            />
            <TextWidget
              text={formatArray(lecture.lecturers, 'name')}
              style={{
                fontSize: 14,
                color: colors.onPrimary,
              }}
            />
          </FlexWidget>
        </FlexWidget>
      ) : (
          <TextWidget
            text={isNextUp ? "End of semester :)" : "No lecture in progress"}
            style={{
              fontSize: 24,
              color: colors.onBackground,
              padding: 10,
              textAlign: 'center'
            }}
          />
        )
      }
      
    </FlexWidget>
  )
}

export default NextUpWidget