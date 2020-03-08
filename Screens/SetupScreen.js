import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Vibration,
  ToastAndroid,
  TouchableNativeFeedback,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import Header from '../components/Header';
import MainButton from '../components/MainButton';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';

const SetupScreen = props => {
  const [status, setStatus] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [list, setList] = useState([]);
  const [region, setRegion] = useState(1);
  const devices = [];
  console.disableYellowBox = true;

  const manager = new BleManager();

  const subscription = manager.onStateChange(state => {
    if (state === 'PoweredOn') {
      subscription.remove();
    }
  }, true);

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    let interval = null;
    if (status) {
      interval = setInterval(() => {
        postHandler();
        console.log('Post handler called');
      }, 5000);
    } else if (!status) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startScanHandler = () => {
    let LowLatency = 2;
    let ScanCallbackType = true;
    let ScanOptions = {scanMode: LowLatency, callbackType: ScanCallbackType};
    console.log('Started Scanning');
    ToastAndroid.show('Started Scanning', ToastAndroid.SHORT);
    Vibration.vibrate(100);
    setStatus(true);
    manager.startDeviceScan(null, ScanOptions, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      setList(devices);
      const deviceIn = element => element.id === device.id;
      const index = devices.findIndex(deviceIn);
      if (index == -1) {
        const {id, name, rssi} = device;
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi, region});
        setList(devices);
      } else {
        devices[index].region = region;
        devices[index].rssi = device.rssi;
        setList(devices);
      }
    });
    setTimeout(() => {
      stopScanHandler();
    }, 18000);
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    ToastAndroid.show('Stopped Scanning', ToastAndroid.SHORT);
    Vibration.vibrate(200);
    setStatus(false);
  };

  const toObject = arr => {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) rv[i] = arr[i];
    return rv;
  };

  const postHandler = () => {
    if (list.length < 1) {
      console.log('Nothing to post');
      ToastAndroid.show('Nothing to posted', ToastAndroid.SHORT);
      Vibration.vibrate(200);
      return;
    }
    const data = toObject(list);
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
        ToastAndroid.show('Successfully posted', ToastAndroid.SHORT);
        Vibration.vibrate(100);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('result:' + error);
      });
  };

  const ItemSeparator = <View style={styles.separator} />;

  const Item = ({device, index}) => {
    return (
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={[DefaultStyles.bodyText, {padding: 3}]}>
            {device.name ? device.name : 'Null'}
            {'  '} {device.rssi}
            {'  '}
            {device.id}
            {'  '}Region: {region}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <Header title={'Navigation App'} />
      <View style={styles.screen}>
        <Text style={[DefaultStyles.title, {padding: 10}]}>
          Setup Bluetooth Device Config. {seconds}
        </Text>
        {status ? (
          <MainButton onPress={stopScanHandler}>Stop Scanning</MainButton>
        ) : (
          <MainButton onPress={startScanHandler}>Start Scanning</MainButton>
        )}
        {list.length == 0 && (
          <View>
            <Text style={[DefaultStyles.title, {padding: 10}]}>
              No BLE Devices
            </Text>
          </View>
        )}
        <View style={styles.control}>
          <FlatList
            style={styles.listContainer}
            key={list.length}
            extraData={list}
            data={list}
            renderItem={({item, index}) => <Item device={item} index={index} />}
            keyExtractor={item => item.id}
          />
        </View>
        {ItemSeparator}
        <View style={styles.listItem}>
          <TouchableNativeFeedback onPress={() => setRegion(1)}>
            <View style={styles.point}>
              <Text
                style={[DefaultStyles.title, {color: 'white', padding: 30}]}>
                1
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setRegion(2)}>
            <View style={styles.point}>
              <Text
                style={[DefaultStyles.title, {color: 'white', padding: 30}]}>
                2
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setRegion(3)}>
            <View style={styles.point}>
              <Text
                style={[DefaultStyles.title, {color: 'white', padding: 30}]}>
                3
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => setRegion(4)}>
            <View style={styles.point}>
              <Text
                style={[DefaultStyles.title, {color: 'white', padding: 30}]}>
                4
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        {ItemSeparator}
        {isActive ? (
          <MainButton onPress={reset}>Stop Timer</MainButton>
        ) : (
          <MainButton onPress={toggle}>Start Timer</MainButton>
        )}
      </View>
    </ScrollView>
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
    justifyContent: 'space-between',
  },
  point: {
    height: 80,
    width: 80,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
  },
  separator: {
    height: 25,
    backgroundColor: '#863bd8',
  },
});

export default SetupScreen;
