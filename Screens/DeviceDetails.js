import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DeviceDetails = props => {
  return (
    <View style={styles.screen}>
      <Text>This Device Details Screen Component!</Text>
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

export default DeviceDetails;
