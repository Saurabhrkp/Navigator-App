import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Tts from 'react-native-tts';

import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';
import Colors from '../constants/colors';
import DefaultStyles from '../constants/default-styles';

const GameOverScreen = props => {
  const [status, setStatus] = useState(false);
  const [list, setList] = useState([]);
  const devices = [];

  const startScanHandler = () => {
    let LowLatency = 2;
    let ScanOptions = {scanMode: LowLatency};
    console.log('Started Scanning');
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
        var txpower = -69;
        var region = 1;
        var checked = false;
        Tts.speak(`New device: ${name}`);
        console.log(`New device: ${id}`);
        devices.push({id, name, rssi, txpower, checked, region});
      } else {
        devices[index].rssi = device.rssi;
      }
      setList(devices);
    });
  };

  const stopScanHandler = () => {
    manager.stopDeviceScan();
    console.log('Stopped Scanning');
    setStatus(!status);
  };
  Tts.addEventListener('tts-start', event => console.log('start'));
  Tts.addEventListener('tts-finish', event => console.log('finish'));
  Tts.addEventListener('tts-cancel', event => console.log('cancel'));

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText>Demo Page</TitleText>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/success.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.resultContainer}>
          <Text style={[DefaultStyles.title, styles.resultText]}>
            This is Test App
          </Text>
        </View>

        <MainButton
          onPress={() => {
            props.navigation.navigate('Start');
          }}>
          Start Scanning
        </MainButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imageContainer: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    borderWidth: 3,
    borderColor: 'black',
    overflow: 'hidden',
    marginVertical: Dimensions.get('window').height / 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    marginHorizontal: 30,
    marginVertical: Dimensions.get('window').height / 60,
  },
  resultText: {
    textAlign: 'center',
    fontSize: Dimensions.get('window').height < 400 ? 16 : 20,
  },
  highlight: {
    color: Colors.primary,
    fontFamily: 'OpenSans-Bold',
  },
});

export default GameOverScreen;
