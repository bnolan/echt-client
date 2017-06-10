import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

// Initial app loading screen

export default class Loading extends React.Component {
  render () {
    return (
      <View style={styles.view}>
        <Icon name='fingerprint' size={42} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
