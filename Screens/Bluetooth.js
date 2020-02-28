import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const BluetoothScreen = props => {
  return (
    <View style={styles.screen}>
      <Text>This Bluetooth Screen Component!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BluetoothScreen;
