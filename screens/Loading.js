import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';

// Initial app loading screen

export default class Loading extends React.Component {
  render () {
    return (
      <View style={[styles.container, styles.loadingScreen]}>
        <Icon name='fingerprint' size={42} />
      </View>
    );
  }
}
