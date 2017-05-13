import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Button } from 'react-native-elements';

export default class Instructions extends React.Component {
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.instructionView}>
        <Text style={styles.instructionHeader}>
          Turn a selfie into a friend
        </Text>

        <Text style={styles.instructionText}>
          Your friends see
          photos you take in Echt.
        </Text>

        <Text style={styles.instructionText}>
          To add a friend, switch to the front facing camera
          and take a selfie with your friend.
        </Text>

        <Text style={styles.instructionText}>
          Echt will recognize your friend
          and send them a friend request.
        </Text>

        <Text style={styles.instructionText}>
          If your friend doesn't use Echt, you send
          them an invitation, and when they sign up, we'll
          add them.
        </Text>

        <View style={styles.instructionButton}>
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
