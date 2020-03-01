import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import BluetoothScreen from '../Screens/Bluetooth';
import DeviceScreen from '../Screens/DeviceDetails';

const DeviceNavigator = createSwitchNavigator({
  Bluetooth: BluetoothScreen,
  Device: DeviceScreen,
});

export default createAppContainer(DeviceNavigator);
