import React from 'react';
import styles from '../styles';
import timeago from 'timeago-words';
import { Text, View, Image } from 'react-native';

const width = 128;
const height = 128;

export default class Friends extends React.Component {
  get photo () {
    return this.props.friend.photo.small.url;
  }

  render () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);

    // FIXMEL compute date so that it updates every minute (less than a minute ago,
    // a minute ago, 2 minutes ago, etc...)

    return (
      <View style={styles.friendItem}>
        <Image
          style={{width: width, height: height, flex: 0.4}}
          source={{uri: this.photo}}
        />

        <View style={styles.friendItemDetail}>
          <Text style={styles.headerSmall}>
            Friend request sent
          </Text>

          <Text style={styles.friendItemText}>
            Sent {timeago(createdAt)}.
          </Text>
        </View>
      </View>
    );
  }
}
