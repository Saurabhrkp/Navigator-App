import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
} from 'react-native';

import Header from '../components/Header';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import DefaultStyles from '../constants/default-styles';

const StartScreen = props => {
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

  return (
    <ScrollView>
      <Header title={'Navigation App'} />
      <View style={styles.screen}>
        <Text style={[DefaultStyles.title, styles.title]}>
          BLE Indoor Navigation App
        </Text>
        <Card style={styles.inputContainer}>
          <Text style={[DefaultStyles.bodyText, styles.body]}>
            Setup Configuration
          </Text>
          <View>
            <MainButton
              onPress={() => {
                props.navigation.navigate('Setup');
              }}>
              Setup
            </MainButton>
          </View>
          <Text style={[DefaultStyles.bodyText, styles.body]}>Run a Test</Text>
          <View>
            <MainButton
              onPress={() => {
                props.navigation.navigate('Demo');
              }}>
              Demo
            </MainButton>
          </View>
        </Card>
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
  title: {
    marginVertical: 10,
    marginBottom: 20,
  },
  body: {
    marginVertical: 20,
    marginBottom: 10,
  },
  inputContainer: {
    width: '80%',
    maxWidth: '95%',
    minWidth: 300,
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default StartScreen;
