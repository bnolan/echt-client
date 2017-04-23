import React from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, View } from 'react-native';

export default class Shutter extends React.Component {
  onPress () {
    console.log('Shutter clicked');
    this.props.onPress();
  }

  render () {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.onPress.bind(this)}>
        <View style={styles.shutter} />
      </TouchableOpacity>
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

