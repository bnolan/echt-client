import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../components/Shutter';
import simulatorUpload from '../helpers/simulator-upload';
import store from '../state/store';
import { CAMERA } from '../constants';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Image, Animated, Dimensions, StyleSheet, View } from 'react-native';

const uploadHeight = 64 + 20;

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.state = {
      cameraData: null,
      cameraType: null,
      slideAnim: new Animated.Value(-uploadHeight)
    };
  }

  componentDidMount () {
    // For #loadFixture
    store.navigation = this.props.navigation;

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

  takePhoto () {
    const options = {};
    var p;

    // Simulator doesn't support cam
    if (this.props.screenProps.isSimulator) {
      p = simulatorUpload();
    } else {
      p = this.camera.capture({metadata: options});
    }

    return p.then((cameraData) => {
      // Normalise cameraData
      cameraData.path = `file://${cameraData.path}`;
      this.setState({ cameraData: cameraData });
    });
  }

  retakePhoto () {
    this.setState({ cameraData: null, error: null, submitting: false });
  }

  submitPhoto () {
    const { cameraData } = this.state;
    const upload = store.generateUpload();

    this.setState({ submitting: true, error: null });

    return store.takePhoto(cameraData, upload, {
      camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
    }).then(r => {
      console.debug('r', r);
      if (r.success) {
        this.setState({ cameraData: null, error: null, submitting: false });
      } else {
        this.setState({ cameraData: null, error: r.message, submitting: false });
      }
    });
  }

  renderCamera () {
    const { width, height } = Dimensions.get('window');

    return (
      <RNCamera
        ref={(cam) => { this.camera = cam; }}
        style={[styles.camera, {width, height}]}
        captureTarget={RNCamera.constants.CaptureTarget.disk}
        captureQuality={RNCamera.constants.CaptureQuality.high}
        type={this.state.cameraType}
        aspect={RNCamera.constants.Aspect.fill}
      />
    );
  }

  renderPreview () {
    const { submitting, cameraData } = this.state;
    const { width, height } = Dimensions.get('window');
    const opacity = submitting ? 0.8 : 1.0;

    return (
      <View style={styles.flex0}>
        <Image
          style={{width: width, height: height, opacity: opacity}}
          source={{uri: cameraData.path}}
        />
      </View>
    );
  }

  render () {
    const { cameraData, submitting } = this.state;
    const previewing = Boolean(cameraData);
    const { width, height } = Dimensions.get('window');
    const cameraView = previewing ? this.renderPreview() : this.renderCamera();

    // Only show toggle when not previewing
    const toggleView = (!previewing &&
      <Icon
        onPress={(e) => this.toggleType()}
        name='sync'
        size={24}
        reverse
        color='black'
        key='toggle'
      />
    );

    const retakeView = (previewing &&
      <Icon
        onPress={(e) => this.retakePhoto()}
        name='refresh'
        size={24}
        reverse
        color='black'
        key='refresh'
      />
    );

    const shutterView = (
      <Shutter
        onPress={(e) => previewing ? this.submitPhoto() : this.takePhoto()}
        isLoading={submitting}
        isReady={previewing && !submitting}
        key='shutter'
      />
    );

    return (
      <View style={styles.container}>
        { cameraView }
        <View style={[styles.overlayContainer, {width: width, height: height}]}>
          <View style={styles.toolbarTop}>
            <View style={styles.toolbarColLeft} />
            <View style={styles.toolbarColCenter}>
              { toggleView }
            </View>
            <View style={styles.toolbarColRight} />
          </View>
          <View style={styles.toolbarBottom}>
            <View style={styles.toolbarColLeft}>
              { retakeView }
            </View>
            <View style={styles.toolbarColCenter}>
              { shutterView }
            </View>
            <View style={styles.toolbarColRight} />
          </View>
        </View>
      </View>
    );
  }
}

// Work with absolute positioning because RNCamera doesn't allow nesting,
// see https://github.com/lwansbrough/react-native-camera/issues/591
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlayContainer: {
    position: 'absolute',
    zIndex: 100,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toolbarTop: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'flex-start',
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  toolbarBottom: {
    flex: 1,
    marginBottom: 30,
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  toolbarColLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    // backgroundColor: '#ff00aa',
    alignItems: 'center'
  },
  toolbarColCenter: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#ff00cc',
    alignItems: 'center'
  },
  toolbarColRight: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: '#ff00ee',
    alignItems: 'center'
  }
});
