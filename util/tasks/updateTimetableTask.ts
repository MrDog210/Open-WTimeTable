import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

import * as Notifications from "expo-notifications";
import { dateFromNow } from "../dateUtils";
import { hasTimetableUpdated, updateLectures } from "../timetableUtils";
import { AppState } from "react-native";
import { hasInternetConnection } from "../http/http";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const TIMETABLE_TASK = "background-fetch-timetable";

// 1. Define the background task globally
TaskManager.defineTask(TIMETABLE_TASK, async () => {
  try {
    console.log("BGTASK STARTING");
    /*sendNotification({
      title: "Checking for updates"
    })*/

    if (AppState.currentState === 'active') {
      sendNotification({
        title: "DEBUG: app open, stopping BG service",
      });
      return BackgroundTask.BackgroundTaskResult.Success;
    }
    
    if (!hasInternetConnection())
      return BackgroundTask.BackgroundTaskResult.Failed;
    
    const hasUpdated = await hasTimetableUpdated();
    console.log("BGTASK HAS UPDATED ", hasUpdated);

    if (hasUpdated) {
      await updateLectures(new Date(), dateFromNow(200), true);
      console.log("BGTASK UPDATE COMPLETE ");

      sendNotification({
        title: "DEBUG: Updated timetable",
      });
    } else {
      console.log("BGTASK NO UPDATE ");

      sendNotification({
        title: "DEBUG: No timetable updates found",
      });
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.log("BGTASK ERROR ", e);

    sendNotification({
      title: "ERROR UPDATING TIMETABLE",
      body: e instanceof Error ? e.message : JSON.stringify(e),
    });
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

const sendNotification = (content: Notifications.NotificationContentInput) => {
  Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
};

// 2. Register and unregister helpers
export const registerTimetableBackgroundTask = async (
  minimumInterval: number,
) => {
  return BackgroundTask.registerTaskAsync(TIMETABLE_TASK, {
    minimumInterval: minimumInterval,
  });
};

export const unregisterTimetableBackgroundTask = async () => {
  return BackgroundTask.unregisterTaskAsync(TIMETABLE_TASK);
};

export const isTimetableBackgroundTaskRegistered = async () => {
  return TaskManager.isTaskRegisteredAsync(TIMETABLE_TASK);
};

export const testbackgroundTask = () =>
  BackgroundTask.triggerTaskWorkerForTestingAsync();
