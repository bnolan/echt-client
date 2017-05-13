import React from 'react';
import { StyleSheet, View, ImagePickerIOS } from 'react-native';
import RNCamera from 'react-native-camera';
import { observer } from 'mobx-react/native';
import RNFS from 'react-native-fs';

import { CAMERA } from '../constants';
import Shutter from './Shutter';
import Upload from './Upload';
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

    // Simulator doesn't support cam
    if (this.props.screenProps.isSimulator) {
      return new Promise((resolve, reject) => {
        ImagePickerIOS.openSelectDialog(
          {},
          imageUri => {
            const tmpFilePath = `${RNFS.TemporaryDirectoryPath}/tmp.jpg`;
            RNFS.copyAssetsFileIOS(imageUri, tmpFilePath, 1024, 1024).then(() => {
              return store.takePhoto({
                path: tmpFilePath
              }, {
                camera: CAMERA.FRONT_FACING
              }).then(response => {
                return resolve(response);
              });
            });
          },
          error => {
            console.log(error);
            reject(error);
          }
        );
      });
    } else {
      return this.camera.capture({metadata: options})
        .then((data) => {
          // Normalise data
          data.path = `file://${data.path}`;
          return store.takePhoto(data, {
            camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
          });
        });
    }
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
