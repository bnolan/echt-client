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
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { colors } from './styles';

const uploadHeight = 64 + 20;

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.state = {
      slideAnim: new Animated.Value(-uploadHeight)
    };
  }

  componentDidMount () {
    // For #loadFixture
    store.navigation = this.props.navigation;

    store.uploads.observe(() => {
      console.log('#uploads observe');
      this.addUpload();
    });

    this.setState({
      cameraType: this.props.screenProps.isSimulator ? RNCamera.constants.Type.front : RNCamera.constants.Type.back
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

      console.log('Uploading...', data);

      return store.takePhoto(data, upload, {
        camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
      });
    }).then(() => {
      console.log('Done uploading...');
    });
  }

  render () {
    const uploads = mobx.toJS(store.uploads).map((u) => {
      return <Upload key={u.uuid} upload={u} navigation={this.props.navigation} />;
    });
    const { width, height } = Dimensions.get('window');

    return (
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={(cam) => { this.camera = cam; }}
          style={[styles.camera, {width, height}]}
          captureTarget={RNCamera.constants.CaptureTarget.disk}
          captureQuality={RNCamera.constants.CaptureQuality.high}
          type={this.state.cameraType}
          aspect={RNCamera.constants.Aspect.fill} />

        <Animated.View style={{ ...uploadStyle, top: this.state.slideAnim }}>
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
      </View>
    );
  }
}

const uploadStyle = {
  position: 'absolute',
  right: 20,
  zIndex: 200
};

// Work with absolute positioning because RNCamera doesn't allow nesting,
// see https://github.com/lwansbrough/react-native-camera/issues/591
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1
  },
  cameraType: {
    borderWidth: 4,
    borderColor: 'red',
    width: 48,
    height: 48,
    borderRadius: 64,
    marginTop: 50,
    zIndex: 200
  },
  uploads: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 200
  },
  toolbar: {
    position: 'absolute',
    top: 20,
    left: 96,
    right: 96,
    alignItems: 'center',
    zIndex: 200
  },
  camera: {
    flex: 1,
    backgroundColor: colors.bgDarker,
    position: 'relative',
    zIndex: 100,
    width: 300,
    height: 300
  }
});
