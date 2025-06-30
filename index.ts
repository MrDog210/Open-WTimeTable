import { registerRootComponent } from 'expo';

import App from './App';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './util/widget-task-handler';

console.log((new Date()).toISOString())
// react native android widhget polyfill
function isSetImmediateFunctional() {
  if (typeof global.setImmediate === 'undefined') {
    return false;
  }
  try {
    global.setImmediate(() => {});
    return true;
  } catch (e) {
    return false;
  }
}

if (!isSetImmediateFunctional()) {
  global.setImmediate = function (handler, ...args) {
    return setTimeout(() => {
      handler(...args);
    }, 0);
  };
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);