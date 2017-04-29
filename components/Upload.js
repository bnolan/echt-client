import React from 'react';
import { TouchableOpacity, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import { Icon } from 'react-native-elements';

const padding = 8;
const iconSize = 16;

export default class Upload extends React.Component {
  onPress () {
    this.props.onPress();
  }

  render () {
    const width = 64;
    const height = 64;

    let icon = null;

    if (this.props.photo.actions) {
      icon =
        <View style={styles.iconView}>
          <Icon
            onPress={(e) => this.toggleType()}
            name='person-add'
            size={iconSize}
            reverse
            color='#FF00AA' />
        </View>;
    }

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.onPress.bind(this)}>
        <View style={styles.border}>
          { icon }

          <ActivityIndicator
            animating
            style={[styles.activity, {height: height - padding}]}
            size='large'
          />

          <Image
            style={{width: width, height: height}}
            source={{uri: this.props.photo.url}}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconView: {
    position: 'absolute',
    left: -iconSize - 8,
    top: -iconSize - 8,
    width: iconSize,
    height: iconSize,
    zIndex: 100
  },
  activity: {
    position: 'absolute',
    zIndex: 90,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding
  },
  border: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 2,
    marginTop: 20
  }
});
