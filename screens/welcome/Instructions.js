import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../styles';
import store from '../../state/store';

export default class Instructions extends React.Component {
  finishSignup () {
    // Automatically navigates to main screen
    store.user.loggedIn = true;
    store.save();
  }

  render () {
    return (
      <View style={[styles.container, styles.instructionsScreen]}>
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

        <View style={styles.welcomeButton}>
          <Button
            raised
            backgroundColor='#ffffff'
            color='#32006C'
            onPress={() => this.finishSignup()}
            style={{width: 240}}
            icon={{name: 'child-care', color: '#32006C'}}
            title='Start' />
        </View>
      </View>
    );
  }
}
