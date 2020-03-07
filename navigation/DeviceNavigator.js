import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import StartScreen from '../Screens/StartScreen';
import SetupScreen from '../Screens/SetupScreen';
import DemoScreen from '../Screens/DemoScreen';

const DeviceNavigator = createSwitchNavigator(
  {
    Start: StartScreen,
    Setup: SetupScreen,
    Demo: DemoScreen,
  },
  {
    initialRouteName: 'Start',
    backBehavior: 'history',
    resetOnBlur: true,
  },
);

export default createAppContainer(DeviceNavigator);
