import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  PermissionsAndroid,
  Button,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import MainButton from '../components/MainButton';
import DefaultStyles from '../constants/default-styles';
import Input from '../components/Input';
import Colors from '../constants/colors';

const SetupScreen = props => {
  const [status, setStatus] = useState(false);
  const enteredValue = [];
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
      const deviceIn = element => element.id === device.id;
      const index = devices.findIndex(deviceIn);
      if (index == -1) {
        const {id, name, rssi} = device;
        var txpower = -69;
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi, txpower});
        setList(devices);
      } else {
        devices[index].rssi = device.rssi;
        setList(devices);
      }
      setList(devices);
    });
  };

  const onRssiHandler = device => {
    const index = list.findIndex(element => element.id === device);
    list[index].txpower = parseInt(enteredValue[index]);
    console.log(list);
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    setStatus(false);
  };

  const toObject = arr => {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) rv[i] = arr[i];
    return rv;
  };

  const postHandler = () => {
    const data = toObject(list);
    fetch('http://192.168.1.103:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  function Item({device, index}) {
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
            maxLength={3}
            keyboardType="numeric"
            onChangeText={text => {
              enteredValue[index] = text;
            }}
            value={enteredValue[index]}
          />
          <Text>{'  '}</Text>
          <Button
            title="Set Power"
            onPress={() => onRssiHandler(device.id)}
            color={Colors.accent}
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
        renderItem={({item, index}) => <Item device={item} index={index} />}
        keyExtractor={item => item.id}
      />
      {!status && list.length > 0 && (
        <View>
          <MainButton onPress={postHandler}>Post Data</MainButton>
        </View>
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
    padding: 0,
    marginVertical: 0,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  button: {
    borderRadius: 15,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
});

export default SetupScreen;
