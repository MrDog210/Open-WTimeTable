import { FlexWidget, ListWidget, SvgWidget, TextWidget } from "react-native-android-widget";
import { Lecture } from "../../types/types";
import { WIDGET_COLORS as colors } from "../../util/constants";
import { getTimeFromDate } from "../../util/dateUtils";
import { formatArray } from "../../util/timetableUtils";

type TodayWidgetProps = {
  lectures: Lecture[]
}

//const ROW_COLORS: ColorProp[] = ['#eb3b5aFF', '#fa8231ff', '#fdf9a0ff', '#20bf6bff', '#0fb9b1ff', '#2d98daff']

function TodayWidget({ lectures }: TodayWidgetProps) {
  return (
    <FlexWidget
      clickAction="REFRESH"
      style={{
        height: 'match_parent',
        width: 'match_parent',
       backgroundColor: colors.primary,
        borderRadius: 15,
      }}
    >
      <FlexWidget style={{ 
        flexDirection: 'row',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <FlexWidget style={{flex: 1}}>
          <TextWidget
            text="Today"
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
        width: 'match_parent',
        paddingBottom: 0,
        backgroundColor: colors.background
      }}>
        <ListWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
          }}>
          {lectures.map((lecture, index) => (
            <FlexWidget key={lecture.id}
              style={{
                padding: 10,
                flexDirection: 'row',
                paddingVertical: 5,
                width: 'match_parent',
                backgroundColor: index % 2 === 1 ? colors.surface : undefined
              }}>
              <FlexWidget style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 'match_parent',
                marginRight: 10
              }}>
                <TextWidget
                  text={getTimeFromDate(lecture.start_time)}
                  style={{
                    fontSize: 14,
                    color: colors.onPrimary,
                    marginBottom: 4
                  }}
                />
                <TextWidget
                  text={getTimeFromDate(lecture.end_time)}
                  style={{
                    fontSize: 14,
                    color: colors.onPrimary,
                  }}
                />
              </FlexWidget>
              <FlexWidget style={{
                  overflow: 'hidden',
                  justifyContent: 'center',
                  height: 'match_parent'
                }}>
                <TextWidget
                  text={`${lecture.course} - ${lecture.executionType}`}
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.onPrimary,
                    height: 20
                  }}
                />
                <TextWidget
                  text={`${formatArray(lecture.rooms, 'name')} - ${formatArray(lecture.lecturers, 'name')}`}
                  style={{
                    fontSize: 14,
                    color: colors.onPrimary,
                  }}
                />
              </FlexWidget>
            </FlexWidget>
          ))}
        </ListWidget>
      </FlexWidget>
    </FlexWidget>
  )
}

export default TodayWidget