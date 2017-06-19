import React from 'react';
import { StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { ACTION } from '../constants';
import { observer } from 'mobx-react/native';

const padding = 8;
const iconSize = 48;
const width = 64;
const height = 64;

@observer export default class Upload extends React.Component {
  onPress () {
    const { navigation: { navigate } } = this.props;
    const action = this.props.upload.actions && this.props.upload.actions[0];

    console.log('#onPress');

    if (action) {
      console.log('navigating...');
      navigate('InviteFriend', { uuid: this.props.upload.uuid });
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
        <Icon
          raised
          style={styles.iconView}
          name={iconName}
          size={iconSize}
          onPress={this.onPress.bind(this)}
          color='#FF00AA' />;
    }

    return (
      <View style={styles.border}>
        <Image
          style={{position: 'absolute', top: 0, zIndex: 90, width: width, height: height}}
          source={{uri: this.props.upload.url}}
        />

        <View style={styles.overlay}>
          { icon ||
            <ActivityIndicator
              animating
              style={[styles.activity, {height: height - padding}]}
              size='large' /> }
        </View>
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
  overlay: {
    zIndex: 100,
    width: width,
    height: height,
    flexDirection: 'column'
  },
  iconView: {
    padding: padding,
    zIndex: 200
  },
  activity: {
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
