import React from 'react';
import { Modal, TouchableHighlight, AsyncStorage, StyleSheet, Image, Text, View } from 'react-native';
import Settings from './settings';
import config from '../config';
import moment from 'moment';

export default class Friends extends React.Component {
  constructor () {
    super();

    this.state = {
      friends: [],
      settingsVisible: false
    };
  }

  componentDidMount () {
    this.reload();
  }

  reload () {
    AsyncStorage.getItem('deviceKey')
      .then((key) => {
        // No user registered yet
        if (!key) {
          return Promise.resolve();
        }

        return fetch(`${config.endpoint.uat}/friends`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'x-devicekey': key
          }
        }).then(
          (response) => response.json()
        ).then((r) => {
          this.setState({
            friends: r.friends || []
          });
        });
      });
  }

  render () {
    const friends = this.state.friends.map((friend) => {
      console.log('friend', friend);
      const since = moment(friend.createdAt).format('MMMM \'YY');
      return (
        <View key={friend.uuid}>
          <Image
            style={{width: 120, height: 120}}
            source={{uri: friend.user.photo.small.url}}
          />
          {friend.user.name && <Text>{friend.user.name}</Text>}
          <Text>{since}</Text>
        </View>
      );
    });

    return (
      <View>
        {friends}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
