import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import NextUpWidget from '../components/widgets/NextUpWidget';
import { getLecturesForDate, getNextLecture } from './store/database';
import TodayWidget from '../components/widgets/TodayWidget';
import { getAllLecturesForDay } from './timetableUtils';

const nameToWidget = {
  NextUp: NextUpWidget,
  Now: TodayWidget,
  Today: TodayWidget
};

async function getInProgressLecture() {
  const lectures = await getLecturesForDate("2025-06-02")
  if (lectures.length === 0) return undefined;
  const now = new Date("2025-06-02T16:10:20");
  now.setHours((new Date()).getHours())
  return lectures.find(lecture => {
    const start = new Date(lecture.start_time);
    const end = new Date(lecture.end_time);
    return now >= start && now <= end;
  });
}

export async function widgetTaskHandler({ renderWidget, widgetInfo, widgetAction}: WidgetTaskHandlerProps) {
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];
  console.log("Widget info ", widgetInfo)
  console.log("Widget action ", widgetAction)
  if(Widget === NextUpWidget) {
    const isNextUp = widgetInfo.widgetName === 'NextUp'
    const lecture = isNextUp ? await getNextLecture() : await getInProgressLecture()
    //console.log(lecture)
    renderWidget(<Widget lecture={lecture} isNextUp={isNextUp} />)
  } else if (Widget === TodayWidget) {
    const tLectures = await getAllLecturesForDay(new Date("2025-06-02"), false)
    const lectures = tLectures.map(tl => tl.lecture)
    lectures.sort((a, b) => a.start_time === b.start_time ? 0 : a.start_time < b.start_time ? -1 : 1)
    //console.log(lectures)
    renderWidget(<Widget lectures={lectures} />)
  }
  
  /*switch (widgetAction) {
    case 'WIDGET_ADDED':
      renderWidget(<Widget lecture={lecture}  />);
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
      console.log("click")
      renderWidget(<Widget lecture={lecture} />)
      if (clickAction === 'play') {
        renderWidget(<Widget status="playing" />);
      } else {
        renderWidget(<Widget status="stopped" />);
      }
      break;

    default:
      break;
  }*/
}