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
          Welcome!
        </Text>

        <Text style={styles.welcomeText}>
          Welcome to Echt, the photo sharing app
          for friends. Echt is different
          because you have to take selfies with people
          to add them as a friend.
        </Text>

        <View style={styles.welcomeButton}>
          <Button
            raised
            backgroundColor='#00aaff'
            color='#ffffff'
            onPress={() => navigate('Selfie')}
            icon={{name: 'cached'}}
            style={{width: 240}}
            title='Continue' />
        </View>
      </View>
    );
  }
}

export default Welcome;
