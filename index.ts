import { registerRootComponent } from 'expo';

import App from './App';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './util/widget-task-handler';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler);