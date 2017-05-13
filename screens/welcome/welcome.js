import React from 'react';
import { Text, View } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import styles from './styles';

class Welcome extends React.Component {
  nextScreen () {

  }
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.welcomeScreen}>
        <Text style={styles.welcomeHeader}>
          Willkommen!
        </Text>

        <Text style={styles.welcomeText}>
          Welcome to Echt, the photo sharing app
          for genuine friends. Echt is different
          because you have to take selfies with people
          to add them as a friend.
        </Text>

        <Icon name='face' size={64} />

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
}

export default Welcome;
