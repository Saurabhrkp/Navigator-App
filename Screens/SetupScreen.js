import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import MainButton from '../components/MainButton';
import DefaultStyles from '../constants/default-styles';
import Input from '../components/Input';

const SetupScreen = props => {
  const [status, setStatus] = useState(false);
  const [list, setList] = useState([]);
  const devices = [];

  const manager = new BleManager();

  useEffect(() => {
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
  }, []);

  const subscription = manager.onStateChange(state => {
    if (state === 'PoweredOn') {
      subscription.remove();
    }
  }, true);

  const startScanHandler = () => {
    let LowLatency = 2;
    let ScanOptions = {scanMode: LowLatency};
    console.log('Started Scanning');
    setStatus(true);
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
      // var txPower = -70;
      // const range = getRange(txPower, device.rssi);
      const deviceIn = element => element.id === device.id;
      const index = devices.findIndex(deviceIn);
      if (index == -1) {
        const {id, name, rssi} = device;
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi});
        setList(devices);
      } else {
        devices[index].rssi = device.rssi;
        // console.dir(devices);
        setList(devices);
      }
    });
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    setStatus(false);
  };

  function Item({device}) {
    return (
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={DefaultStyles.bodyText}>
            {device.name}
            {'  '} {device.rssi}
            {'  '} {device.id}
            {'  '}
          </Text>
          <Input
            style={styles.input}
            keyboardType="default"
            autoCapitalize="sentences"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Setup Bluetooth Device Config.</Text>
      {status ? (
        <MainButton onPress={stopScanHandler}>Stop Scanning</MainButton>
      ) : (
        <MainButton onPress={startScanHandler}>Start Scanning</MainButton>
      )}
      {list.length == 0 && (
        <View>
          <Text style={DefaultStyles.title}>No peripherals</Text>
        </View>
      )}
      <FlatList
        style={styles.listContainer}
        key={list.length}
        extraData={list}
        data={list}
        renderItem={({item}) => <Item device={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  listContainer: {
    flex: 1,
    width: '95%',
  },
  list: {
    flexGrow: 1,
    // alignItems: 'center',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  input: {
    height: 20,
    // paddingHorizontal: 2,
    // paddingVertical: 5,
    padding: 0,
    marginVertical: 0,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  },
});

export default SetupScreen;
