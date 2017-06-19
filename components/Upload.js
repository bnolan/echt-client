import React from 'react';
import { TouchableHighlight, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { ACTION } from '../constants';
import { observer } from 'mobx-react/native';

const padding = 8;
const iconSize = 16;
const width = 64;
const height = 64;

@observer export default class Upload extends React.Component {
  onPress () {
    const { navigation: { navigate } } = this.props;
    const action = this.props.upload.actions && this.props.upload.actions[0];

    if (action) {
      console.log('navigating...');
      navigate('InviteFriend', { uuid: action.user.uuid });
    } else {
      // redirect to photo in newsfeed
    }
  }

  render () {
    let icon = null;
    let iconName = null;

    if (this.props.upload.actions) {
      const type = this.props.upload.actions[0].type;

      if (type === ACTION.ADD_FRIEND) {
        iconName = 'person-add';
      } else if (type === ACTION.GROUPIE) {
        // couldn't find a better icon, come at me bro
        iconName = 'hot-tub';
      }

      icon =
        <View style={styles.iconView}>
          <Icon
            name={iconName}
            size={iconSize}
            reverse
            color='#FF00AA' />
        </View>;
    }

    return (
      <View style={styles.border}>
        <TouchableHighlight style={styles.container} activeOpacity={0.5} onPress={this.onPress.bind(this)}>
          { icon }
        </TouchableHighlight>

        <TouchableHighlight style={styles.container} activeOpacity={0.5} onPress={this.onPress.bind(this)}>
          <View style={styles.container} >
            <ActivityIndicator
              animating
              style={[styles.activity, {height: height - padding}]}
              size='large' />

            <Image
              style={{width: width, height: height}}
              source={{uri: this.props.upload.url}}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 90
  },
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
    top: 5,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding
  },
  border: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 2,
    marginTop: 20,
    backgroundColor: '#333333'
  }
});
