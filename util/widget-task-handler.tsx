import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import NextUpWidget from '../components/widgets/NextUpWidget';
import { getLecturesForDate } from './store/database';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  NextUp: NextUpWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];
  const lectures = await getLecturesForDate((new Date("2025-06-02").toISOString()))
  const lecture = lectures.length > 0 ? lectures[0] : undefined
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_DELETED':
      // Handle widget deleted (remove widget data if you stored it somewhere)
      break;

    case 'WIDGET_CLICK':
      /*if (props.clickAction === 'play') {
        props.renderWidget(<Widget status="playing" />);
      } else {
        props.renderWidget(<Widget status="stopped" />);
      }*/
      break;

    default:
      break;
  }
}