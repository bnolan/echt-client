import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon, Button } from 'react-native-elements';

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

        <Text style={styles.text}>
          Welcome to Echt, the photo sharing app
          for friends. Echt is different
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

// http://www.colourlovers.com/palette/3636765/seapunk_vaporwave
// http://www.colourlovers.com/palette/3887337/Pale_Glitter

const styles = StyleSheet.create({
  settingsButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4
  },

  // Pink and white
  container: {
    backgroundColor: '#FF6AD5',
    flex: 1
  },
  header: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  text: {
    color: '#000000',
    margin: 24,
    fontSize: 18
  }
});

export default Welcome;
