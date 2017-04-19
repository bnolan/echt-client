import React from 'react';
import { Modal, TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';

export default class Shutter extends React.Component {
  render () {
    return (
        <TouchableHighlight onPress={this.props.onPress}>
          <View style={styles.shutter} />
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  shutter: {
    borderWidth: 4,
    borderColor: 'white',
    width: 64,
    height: 64,
    borderRadius: 48,
    marginTop: 400
  }
});

