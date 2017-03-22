/* globals fetch */

import React from 'react';
import { Modal, TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';
import Settings from './settings';

export default class Friends extends React.Component {
  constructor () {
    super();

    this.state = {
      friends: [],
      settingsVisible: false
    };
  }

  componentDidMount () {
    // fetch(`${endpoint}/friends`, {
    //   headers: {
    //     'x-devicekey': '123' // benKey
    //   }
    // }).then(
    //   (response) => response.json()
    // ).then((r) => {
    //   console.log(r);

    //   this.setState({
    //     photos: r.items.reverse()
    //   });
    // });
  }

  render () {
    const friends = this.state.friends.map((friend) => {
      return (
        <View>
          <Image
            style={{width: 120, height: 120}}
            source={{uri: friend.small.url}}
          />
          <Text>Ingo</Text>
          <Text>Since January '17</Text>
        </View>
      );
    });

    return (
      <View>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.settingsVisible}>
          <Settings onClose={(e) => this.setState({settingsVisible: false})} />
        </Modal>

        <TouchableHighlight onPress={(e) => this.setState({settingsVisible: true})}>
          <View style={styles.settingsButton}><Text>Settings</Text></View>
        </TouchableHighlight>

        {friends}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingsButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4
  }
});

