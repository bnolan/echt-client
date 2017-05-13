import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';
import Shutter from '../../components/Shutter';

export default class Selfie extends React.Component {
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.selfieScreen}>
        <Text style={styles.selfieHeader}>How's your hair?</Text>

        <Text style={styles.selfieText}>Take a selfie</Text>

        <Icon name='camera-alt' size={64} />

        <View style={styles.selfieCamera}>
          <Shutter onPress={() => navigate('Pincode')} />
        </View>

        <Text style={styles.selfieTextSmall}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or your phone number.
        </Text>
      </View>
    );
  }
}
