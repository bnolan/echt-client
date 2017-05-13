import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

class Welcome extends React.Component {
  nextScreen () {

  }
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.welcomeScreen}>
        <Text style={styles.welcomeHeader}>Welcome</Text>
        <Text style={styles.welcomeText}>The friendly little shared photo roll app.</Text>
        <Text style={styles.welcomeText}>Nice to meet you! 😍</Text>

        <Button
          raised
          backgroundColor='#FF6AD5'
          color='#ffffff'
          onPress={() => navigate('Selfie')}
          icon={{name: 'cached'}}
          title='Continue' />
      </View>
    );
  }
};

export default Welcome;
