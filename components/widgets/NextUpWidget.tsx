import { FlexWidget, TextWidget } from "react-native-android-widget"
import { Lecture } from "../../types/types"

type NextUpWidgetProps = {
  lecture?: Lecture
}

function NextUpWidget({ lecture }: NextUpWidgetProps) {

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
      }}
    >
      { lecture ? (
        <TextWidget
          text={lecture.course}
          style={{
            fontSize: 25,
            color: '#000000',
          }}
        />
      ) : (
          <TextWidget
            text="NO LECTURE"
            style={{
              fontSize: 30,
              color: '#000000',
            }}
          />
        )
      }
      
    </FlexWidget>
  )
}

export default NextUpWidget