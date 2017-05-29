import mobx from 'mobx';
import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from './Shutter';
import simulatorUpload from '../helpers/simulator-upload';
import store from '../state/store';
import Upload from './Upload';
import { CAMERA } from '../constants';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { StyleSheet, View } from 'react-native';

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.state = {
      cameraType: RNCamera.constants.Type.back
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
    var upload = store.generateUpload();

    const options = {};
    var p;

    // Simulator doesn't support cam
    if (this.props.screenProps.isSimulator) {
      p = simulatorUpload();
    } else {
      p = this.camera.capture({metadata: options});
    }

    return p.then((data) => {
      // Normalise data
      data.path = `file://${data.path}`;
      
      return store.takePhoto(data, upload, {
        camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
      });
    });
  }

  render () {
    const uploads = mobx.toJS(store.uploads).map((u) => {
      return <Upload key={u.uuid} upload={u} onPress={() => 'lol'} />;
    });

    console.log('Camera#render');

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
    top: 0,
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
