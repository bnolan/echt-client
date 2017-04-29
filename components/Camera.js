import React from 'react';
import { StyleSheet, View } from 'react-native';
// Lightbox is ganky and out of date but shows the idea
import RNCamera from 'react-native-camera';
import { observer } from 'mobx-react/native';

import { CAMERA } from '../constants';
import Shutter from './Shutter';
import Upload from './upload';
import { Icon } from 'react-native-elements';
import store from '../state/store';

@observer
export default class Camera extends React.Component {
  constructor () {
    super();

    this.state = {
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

    console.log('takePhoto clicked');

    return this.camera.capture({metadata: options})
      .then((data) => {
        return store.takePhoto(data, {
          camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
        });
      });
  }

  render () {
    const uploads = store.uploads.map((u) => {
      return <Upload key={u.uuid} photo={u} onPress={() => 'lol'} />;
    });

    return (
      <RNCamera
        ref={(cam) => { this.camera = cam; }}
        style={styles.preview}
        captureTarget={RNCamera.constants.CaptureTarget.disk}
        captureQuality={RNCamera.constants.CaptureQuality.high}
        type={this.state.cameraType}
        aspect={RNCamera.constants.Aspect.fill}>

        <View style={styles.uploads}>
          {uploads}
        </View>

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
  uploads: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  toolbar: {
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
