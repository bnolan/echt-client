import React from 'react';
import { TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import {
  Icon
} from 'native-base';

export default class Shutter extends React.Component {
  onPress () {
    this.props.onPress();
  }

  render () {
    const { isLoading, isReady } = this.props;
    const spinnerView = (isLoading &&
      <ActivityIndicator
        animating size='large'
        style={[styles.spinner, {width: this.width, height: this.width}]}
        color='white'
      />
    );
    const iconView = (isReady &&
      <View style={styles.iconContainer}>
        <Icon
          name='checkmark-circle'
          active
          style={{fontSize: 110, color: 'white'}}
        />
      </View>
    );

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.onPress.bind(this)}>
        <View style={styles.shutter} />
        { spinnerView }
        { iconView }
      </TouchableOpacity>
    );
  }
}

Shutter.propTypes = {
  isLoading: PropTypes.bool,
  isReady: PropTypes.bool,
  icon: PropTypes.string
};

Shutter.defaultProps = {
  isLoading: false,
  isReady: false
};

const styles = StyleSheet.create({
  shutter: {
    borderWidth: 5,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    width: 90,
    height: 90,
    borderRadius: 70
  },
  // Render inside shutter
  spinner: {
    position: 'absolute',
    zIndex: 200,
    // TODO Change spinner with one that we can make the full dimensions
    top: 29,
    left: 29
  },
  // Render inside shutter
  iconContainer: {
    position: 'absolute',
    top: -10, // line height weirdness?
    zIndex: 200,
    backgroundColor: 'transparent'
  }
});
