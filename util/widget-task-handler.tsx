import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import NextUpWidget from '../components/widgets/NextUpWidget';
import { getLecturesForDate } from './store/database';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  NextUp: NextUpWidget,
};

export async function widgetTaskHandler({ renderWidget, widgetInfo, widgetAction}: WidgetTaskHandlerProps) {
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];
  const lectures = await getLecturesForDate("2025-06-02")
  const lecture = lectures.length > 0 ? lectures[0] : undefined
  switch (widgetAction) {
    case 'WIDGET_ADDED':
      renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_UPDATE':
      renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_RESIZED':
      renderWidget(<Widget lecture={lecture} />);
      break;

    case 'WIDGET_DELETED':
      // Handle widget deleted (remove widget data if you stored it somewhere)
      break;

    case 'WIDGET_CLICK':
      renderWidget(<Widget lecture={lecture} />)
      /*if (clickAction === 'play') {
        renderWidget(<Widget status="playing" />);
      } else {
        renderWidget(<Widget status="stopped" />);
      }*/
      break;

    default:
      break;
  }
}