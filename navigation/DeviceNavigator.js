import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import StartScreen from '../Screens/StartScreen';
import SetupScreen from '../Screens/SetupScreen';
import DemoScreen from '../Screens/DemoScreen';
// import * as util from 'util';

const DeviceNavigator = createSwitchNavigator(
  {
    Start: StartScreen,
    Setup: SetupScreen,
    Demo: DemoScreen,
  },
  {
    initialRouteName: 'Start',
    backBehavior: 'history',
  },
);
// console.log(util.inspect(DeviceNavigator));

export default createAppContainer(DeviceNavigator);
