import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Platform,
  PermissionsAndroid,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';
import DefaultStyles from '../constants/default-styles';
import TitleText from '../components/TitleText';

const SetupScreen = props => {
  const [status, setStatus] = useState(false);

  const manager = new BleManager();

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ).then(result => {
      if (result) {
        console.log('Permission is OK');
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ).then(result => {
          if (result) {
            console.log('User accept');
          } else {
            console.log('User refuse');
          }
        });
      }
    });
  }

  const subscription = manager.onStateChange(state => {
    if (state === 'PoweredOn') {
      subscription.remove();
    }
  }, true);

  const startScanHandler = () => {
    let LowLatency = 2;
    let ScanOptions = {scanMode: LowLatency};
    console.log('Started Scanning');
    manager.startDeviceScan(null, ScanOptions, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      /**
       ** Formula to calculate distance of BLE devices using there RSSI value and there average RSSI value at one metre
       */
      function getRange(txCalibratedPower, rssi) {
        var ratio_db = txCalibratedPower - rssi;
        var ratio_linear = Math.pow(10, ratio_db / 10);
        var range = Math.sqrt(ratio_linear);
        return range;
      }

      /**
       *? TxPowerLevel(RSSI value) of each BLE Device at one metre distance
       * TODO: Measure actual value before use.
       */
      var txPower = -70;
      const range = getRange(txPower, device.rssi);
      console.log(
        `${device.name}       ${device.rssi}        ${device.id}      ${range}`,
      );
      setStatus(true);
    });
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    setStatus(false);
  };

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Setup Bluetooth Device Config.</Text>
      {status ? (
        <MainButton
          onPress={() => {
            stopScanHandler();
          }}>
          Stop Scanning
        </MainButton>
      ) : (
        <MainButton
          onPress={() => {
            startScanHandler();
          }}>
          Start Scanning
        </MainButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
    width: 400,
    maxWidth: '90%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  listContainer: {
    flex: 1,
    width: '60%',
  },
  listContainerBig: {
    flex: 1,
    width: '80%',
  },
  list: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default SetupScreen;
