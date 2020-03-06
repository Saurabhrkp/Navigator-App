import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  CheckBox,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import Input from '../components/Input';
import MainButton from '../components/MainButton';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';

const SetupScreen = props => {
  const [status, setStatus] = useState(false);
  const [list, setList] = useState([]);
  const enteredRssi = [];
  const enteredRegion = [];
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
  }, [Platform.OS]);

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
        var region = 1;
        var checked = false;
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi, txpower, checked, region});
      } else {
        devices[index].rssi = device.rssi;
      }
      setList(devices);
    });
  };

  const onInputHandler = device => {
    const index = list.findIndex(element => element.id === device);
    list[index].txpower = parseInt(enteredRssi[index]);
    list[index].region = parseInt(enteredRegion[index]);
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

  var removeByAttr = function(arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const postHandler = () => {
    console.log(list);
    const result = removeByAttr(list, 'checked', false);
    console.log(result);
    const data = toObject(result);
    fetch('http://192.168.1.106:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        if (!result.error) {
          Alert.alert('Successful', 'Posted data to server Success', [
            {text: 'OK', onPress: () => null},
          ]);
        } else {
          Alert.alert(result.error_msg);
          console.log(result);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('result:' + error);
      });
  };

  const checkThisBox = (device, index) => {
    device.checked = !device.checked;
    list[index].checked = device.checked;
    console.log(list);
  };

  const Check = ({device, index}) => {
    return (
      <View style={styles.list}>
        <View style={styles.listItem}>
          <CheckBox
            value={device.checked}
            // onChange={() => checkThisBox(device, index)}
            onValueChange={() => checkThisBox(device, index)}
          />
        </View>
      </View>
    );
  };

  const Item = ({device, index}) => {
    return (
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={DefaultStyles.bodyText}>
            {device.name ? device.name : 'No Name'}
            {'  '} {device.rssi}
            {'  '}
          </Text>
          <Input
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
            onChangeText={text => {
              enteredRssi[index] = text;
            }}
            value={enteredRssi[index]}
          />
          <Input
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
            onChangeText={text => {
              enteredRegion[index] = text;
            }}
            value={enteredRegion[index]}
          />
          <Text>{'  '}</Text>
          <Button
            title="Set Power"
            onPress={() => onInputHandler(device.id)}
            color={Colors.accent}
          />
        </View>
      </View>
    );
  };

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
      <View style={styles.control}>
        {!status && list.length > 0 && (
          <FlatList
            style={styles.checkboxContainer}
            data={list}
            renderItem={({item, index}) => (
              <Check device={item} index={index} />
            )}
            keyExtractor={item => item.id}
          />
        )}
        <FlatList
          style={styles.listContainer}
          key={list.length}
          extraData={list}
          data={list}
          renderItem={({item, index}) => <Item device={item} index={index} />}
          keyExtractor={item => item.id}
        />
      </View>

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
  control: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  listContainer: {
    width: '80%',
  },
  checkboxContainer: {
    width: '5%',
  },
  list: {
    flexGrow: 1,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  input: {
    height: 32,
    padding: 0,
    marginVertical: 0,
    borderBottomColor: Colors.accent,
    borderBottomWidth: 2,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default SetupScreen;
