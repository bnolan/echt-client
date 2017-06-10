import mobx from 'mobx';
import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../components/Shutter';
import simulatorUpload from '../helpers/simulator-upload';
import store from '../state/store';
import Upload from '../components/Upload';
import { CAMERA } from '../constants';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const uploadHeight = 64 + 20;

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.state = {
      cameraType: RNCamera.constants.Type.back,
      slideAnim: new Animated.Value(-uploadHeight)
    };
  }

  componentDidMount () {
    store.uploads.observe(() => {
      console.log('#uploads observe');
      this.addUpload();
    });
  }

  toggleType () {
    if (this.state.cameraType === RNCamera.constants.Type.front) {
      this.setState({cameraType: RNCamera.constants.Type.back});
    } else {
      this.setState({cameraType: RNCamera.constants.Type.front});
    }
  }

  addUpload () {
    this.state.slideAnim.setValue(-uploadHeight);

    Animated.timing(
      this.state.slideAnim, {
        fromValue: -uploadHeight,
        toValue: 1,
        easing: Easing.linear,
        duration: 1000 / 60 * 10
      }
    ).start();
  }

  takePhoto () {
    const options = {};
    const upload = store.generateUpload();
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

        <Animated.View style={[styles.uploads, { top: this.state.slideAnim }]}>
          {uploads}
        </Animated.View>

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