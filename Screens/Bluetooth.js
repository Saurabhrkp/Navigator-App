import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const BluetoothScreen = props => {
  console.log(props);
  return (
    <View style={styles.screen}>
      <Text>This Bluetooth Screen Component!</Text>
      <Button
        title="Go to Device Screen"
        onPress={() => {
          props.navigation.navigate('Device');
        }}
      />
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
