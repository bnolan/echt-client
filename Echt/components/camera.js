/* globals fetch */

import React from 'react';
import { AsyncStorage, TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';
// Lightbox is ganky and out of date but shows the idea
import RNCamera from 'react-native-camera';
import RNFS from 'react-native-fs';
import { CAMERA } from '../constants';
import config from '../config';
import Shutter from './shutter';
import { Icon } from 'react-native-elements';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

export default class Camera extends React.Component {

  constructor () {
    super();

    this.state = {
      photos: [],
      cameraType: RNCamera.constants.Type.front
    };
  }

  toggleType () {
    if (this.state.cameraType === RNCamera.constants.Type.front) {
      this.setState({cameraType: RNCamera.constants.Type.back});
    } else {
      this.setState({cameraType: RNCamera.constants.Type.front});
    }
  }

  takePhoto () {
    const options = {};
    var key;

    AsyncStorage.getItem('deviceKey').then((k) => {
      key = k;

      return this.camera.capture({metadata: options});
    }).then((data) => {
      console.log(data.path);
      return RNFS.readFile(data.path, 'base64');
    }).then((data) => {
      const request = {
        image: data,
        camera: CAMERA.FRONT_FACING
      };

      return fetch(`${config.endpoint.uat}/photos`, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'x-devicekey': key
        },
        body: JSON.stringify(request)
      });
    }).then(
      (response) => response.json()
    ).then((json) => {
      console.log(JSON.stringify(json));
    }).catch(err => console.error(err));
  }

  render () {
    return (
      <RNCamera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        captureTarget={RNCamera.constants.CaptureTarget.disk}
        captureQuality={RNCamera.constants.CaptureQuality.high}
        type={this.state.cameraType}
        aspect={RNCamera.constants.Aspect.fill}>

        <View style={styles.toolbar}>
          <Icon
            onPress={(e) => this.toggleType()}
            name='sync'
            size={24}
            reverse
            color='#FF00AA' />
        </View>

        <Shutter onPress={(e) => this.takePhoto()} />
      </RNCamera>
    );
  }
}

const styles = StyleSheet.create({
  cameraType: {
    borderWidth: 4,
    borderColor: 'red',
    width: 48,
    height: 48,
    borderRadius: 64,
    marginTop: 50
  },
  toolbar:{
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});
