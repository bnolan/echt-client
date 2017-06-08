import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

export default class Shutter extends React.Component {
  onPress () {
    console.log('Shutter clicked');
    this.props.onPress();
  }

  render () {
    return (
      <TouchableOpacity style={styles.layout} activeOpacity={0.5} onPress={this.onPress.bind(this)}>
        <View style={styles.shutter} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    bottom: 100,
    zIndex: 900
  },
  shutter: {
    borderWidth: 4,
    borderColor: '#FF00AA',
    backgroundColor: '#ffffff',
    width: 64,
    height: 64,
    borderRadius: 48,
    zIndex: 1000,
    position: 'absolute'
  }
});
