import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Instructions extends React.Component {
  render () {
    return (
      <View>
        <Text>
          Ok here's how it works
        </Text>

        <Text style={styles.hugeEmoji}>💋</Text>

        <Text>
          Echt (it's pronounced like ekt) is a photo
          app. Take a photo and it posts it to your
          special Echt photo roll. Anyone who is your
          friend will be able to see your photos.
        </Text>

        <Text>
          To add a friend, switch to the 🔁 front face camera
          and take a selfie with your friend.
        </Text>

        <Text>
          When you take the photo, Echt will recognize your friend
          and send them a friend invite.
        </Text>

        <Text>
          If your friend doesn't use the app yet, you can send
          them an invitation, and after they sign up, we'll
          add you as friends.
        </Text>

        <Text>
          And you turned a selfie into a friend. 😮
        </Text>
      </View>
    );
  }
};
