// src/tasks/BackgroundNewsTask.ts
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { hasTimetableUpdated, updateLectures } from '../util/timetableUtils';
import { dateFromNow } from '../util/dateUtils';

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const TIMETABLE_TASK = 'background-fetch-timetable';

// 1. Define the background task globally
TaskManager.defineTask(TIMETABLE_TASK, async () => {
  try {
    console.log("BGTASK STARTING")
    /*sendNotification({
      title: "Checking for updates"
    })*/
    const hasUpdated = await hasTimetableUpdated()
    console.log("BGTASK HAS UPDATED ", hasUpdated)

    if(hasUpdated) {
      await updateLectures(new Date(), dateFromNow(200), true)
      console.log("BGTASK UPDATE COMPLETE ")

      sendNotification({
      title: "Updated timetable"
    })
    } else {
      console.log("BGTASK NO UPDATE ")

      sendNotification({
      title: "No updates found"
    })
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.log("BGTASK ERROR ", e)

    sendNotification({
      title: "ERROR"
    })
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
export const registerTimetableBackgroundTask = () =>
  BackgroundTask.registerTaskAsync(TIMETABLE_TASK, { minimumInterval: 15 });

export const unregisterTimetableBackgroundTask = () =>
  BackgroundTask.unregisterTaskAsync(TIMETABLE_TASK);

export const isTimetableBackgroundTaskRegistered = () =>
  TaskManager.isTaskRegisteredAsync(TIMETABLE_TASK);

export const testbackgroundTask = () => BackgroundTask.triggerTaskWorkerForTestingAsync();