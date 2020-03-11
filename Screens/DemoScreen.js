import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Vibration,
  ToastAndroid,
  DeviceEventEmitter,
  TouchableNativeFeedback,
} from 'react-native';
import Tts from 'react-native-tts';
import {BleManager} from 'react-native-ble-plx';
import BackgroundTimer from 'react-native-background-timer';

import Colors from '../constants/colors';

const GameOverScreen = props => {
  const [status, setStatus] = useState(false);
  const [list, setList] = useState([]);
  const devices = [];

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.speak('This is Demo page.');
      // Screen is divided into two parts, and both parts are button for interaction.
    });
  }, []);

  const manager = new BleManager();

  BackgroundTimer.start(5000);
  const startScanHandler = () => {
    let LowLatency = 2;
    let ScanOptions = {scanMode: LowLatency};
    ToastAndroid.show('Started Scanning', ToastAndroid.SHORT);
    Vibration.vibrate(100);
    Tts.speak('Started Scanning');
    setStatus(!status);
    manager.startDeviceScan(null, ScanOptions, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      const deviceIn = element => element.id === device.id;
      const index = devices.findIndex(deviceIn);
      if (index == -1) {
        const {id, name, rssi} = device;
        Tts.speak(`New device: ${name} added`);
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi});
      } else {
        devices[index].rssi = device.rssi;
      }
      setList(devices);
    });
  };

  DeviceEventEmitter.addListener('backgroundTimer', () => {
    // this will be executed once after 5 seconds
    postHandler();
    Tts.speak('Post handler called');
  });

  const toObject = arr => {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) rv[i] = arr[i];
    return rv;
  };

  const postHandler = () => {
    console.log(list);
    const data = toObject(list);
    console.log(data);
    fetch('http://192.168.1.100:3000/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        Tts.speak(`Success: ${result}`);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('result:' + error);
      });
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    ToastAndroid.show('Stopped Scanning', ToastAndroid.SHORT);
    Vibration.vibrate(100);
    BackgroundTimer.stop();
    Tts.speak('Stopped Scanning');
    setStatus(!status);
  };

  const ItemSeparator = <View style={styles.separator} />;

  return (
    <View style={styles.screen}>
      {!status ? (
        <TouchableNativeFeedback
          onPress={() => console.warn('press')}
          onLongPress={startScanHandler}>
          <View style={[styles.button, {backgroundColor: Colors.primary}]} />
        </TouchableNativeFeedback>
      ) : (
        <TouchableNativeFeedback
          onPress={() => console.warn('press')}
          onLongPress={stopScanHandler}>
          <View style={[styles.button, {backgroundColor: Colors.primary}]} />
        </TouchableNativeFeedback>
      )}
      {ItemSeparator}
      <TouchableNativeFeedback
        onPress={postHandler}
        onLongPress={() => console.warn('Long Press')}>
        <View style={[styles.button, {backgroundColor: Colors.accent}]} />
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  button: {
    height: Dimensions.get('window').height * 0.5,
  },
  separator: {
    height: 50,
    backgroundColor: '#863bd8',
  },
});

export default GameOverScreen;
