import React from 'react';
import { Dimensions, TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';

const {height, width} = Dimensions.get('window');

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
    borderColor: '#FF00AA',
    backgroundColor: '#ffffff',
    width: 64,
    height: 64,
    borderRadius: 48,
    marginBottom: 20
  }
});

