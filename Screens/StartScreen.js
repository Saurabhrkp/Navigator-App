import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';

import Card from '../components/Card';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton.android';

const StartGameScreen = props => {
  const [buttonWidth, setButtonWidth] = useState(
    Dimensions.get('window').width / 2,
  );

  useEffect(() => {
    const updateLayout = () => {
      setButtonWidth(Dimensions.get('window').width / 4);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText style={styles.title}>BLE Indoor Navigation App</TitleText>
        <Card style={styles.inputContainer}>
          <BodyText style={styles.body}>Setup Configuration</BodyText>
          <View style={styles.buttonContainer}>
            <MainButton
              onPress={() => {
                props.navigation.navigate('Setup');
              }}>
              Setup
            </MainButton>
          </View>
          <BodyText style={styles.body}>Run a Test</BodyText>
          <View style={styles.buttonContainer}>
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
    fontSize: 26,
    marginVertical: 10,
    marginBottom: 20,
    fontFamily: 'OpenSans-Bold',
  },
  body: {
    fontSize: 20,
    marginVertical: 20,
    marginBottom: 10,
    fontFamily: 'OpenSans-Bold',
  },
  inputContainer: {
    width: '80%',
    // maxWidth: '80%',
    maxWidth: '95%',
    minWidth: 300,
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
});

export default StartGameScreen;
