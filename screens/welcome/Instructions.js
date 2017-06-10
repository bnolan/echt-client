import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default class Instructions extends React.Component {
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Turn a selfie into a friend
        </Text>

        <Text style={styles.text}>
          Your friends see
          photos you take in Echt.
        </Text>

        <Text style={styles.text}>
          To add a friend, switch to the front facing camera
          and take a selfie with your friend.
        </Text>

        <Text style={styles.text}>
          Echt will recognize your friend
          and send them a friend request.
        </Text>

        <Text style={styles.text}>
          If your friend doesn't use Echt, you send
          them an invitation, and when they sign up, we'll
          add them.
        </Text>

        <View style={styles.button}>
          <Button
            raised
            backgroundColor='#ffffff'
            color='#32006C'
            onPress={() => navigate('Main')}
            icon={{name: 'child-care', color: '#32006C'}}
            title='Start' />
        </View>
      </View>
    );
  }
}

// http://www.colourlovers.com/palette/3636765/seapunk_vaporwave
// http://www.colourlovers.com/palette/3887337/Pale_Glitter

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#32006C',
    flex: 1
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  text: {
    color: '#FFFFFF',
    margin: 24,
    marginBottom: 24,
    marginTop: 0,
    fontSize: 16
  },
  button: {

  }

});
