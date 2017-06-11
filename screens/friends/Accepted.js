import React from 'react';
import strftime from 'strftime';
import styles from '../styles';
import { TouchableHighlight, Text, View, Image } from 'react-native';

const width = 128;
const height = 128;

export default class Friends extends React.Component {
  get photo () {
    return this.props.friend.photo && this.props.friend.photo.small.url;
  }

  onPress () {
    const { navigation: { navigate } } = this.props;
    navigate('Friend', { uuid: this.props.friend.uuid });
  }

  render () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);

    return (
      <View style={styles.friendItem}>
        <TouchableHighlight
          style={{flex: 0.4}}
          onPress={() => this.onPress()}>
          <Image
            style={{width: width, height: height}}
            source={{uri: this.photo}}
          />
        </TouchableHighlight>

        <View style={styles.friendItemDetail}>
          <Text style={styles.headerSmall}>
            Friend
          </Text>

          <Text style={styles.friendItemText}>
            Since {strftime('%B %d', createdAt)}.
          </Text>
        </View>
      </View>
    );
  }
}
