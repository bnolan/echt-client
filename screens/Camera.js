import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../components/Shutter';
import simulatorUpload from '../helpers/simulator-upload';
import store from '../state/store';
import { CAMERA } from '../constants';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Animated, Easing, Dimensions, StyleSheet, View, findNodeHandle } from 'react-native';
const UIManager = require('NativeModules').UIManager;

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.refsToMeasure = ['feedIconContainer'];
    this.refMeasures = {};

    this.state = {
      isPreviewing: false,
      isSubmitting: false,
      cameraData: null,
      cameraType: null,
      previewWidthAnim: null,
      previewHeightAnim: null,
      previewTopAnim: null,
      previewLeftAnim: null,
      previewOpacityAnim: null,
      previewRadiusAnim: null,
      flashAnim: new Animated.Value(0)
    };
  }

  resetAnims () {
    const { width, height } = Dimensions.get('window');
    this.setState({
      previewWidthAnim: new Animated.Value(width),
      previewHeightAnim: new Animated.Value(height),
      previewTopAnim: new Animated.Value(0),
      previewLeftAnim: new Animated.Value(0),
      previewOpacityAnim: new Animated.Value(1),
      previewRadiusAnim: new Animated.Value(1)
    });
  }

  componentDidMount () {
    // For #loadFixture
    store.navigation = this.props.navigation;

    this.resetAnims();

    this.setState({
      cameraType: RNCamera.constants.Type.front
    });

    // Wait with measurements until next render loop (when elements are on screen)
    // This assumes that every element measured here is always rendered.
    // See https://stackoverflow.com/questions/30096038/react-native-getting-the-position-of-an-element
    setTimeout(this.measureRefs.bind(this));
  }

  measureRefs () {
    this.refsToMeasure.forEach(ref => {
      if (!this.refs || !this.refs[ref]) return;

      const handle = findNodeHandle(this.refs[ref]);
      UIManager.measure(handle, (x, y, width, height, pX, pY) => {
        this.refMeasures[ref] = {
          x,
          y,
          width,
          height,
          pX,
          pY
        };
      });
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
      // Simulate a flash
      this.state.flashAnim.setValue(1);
      Animated.timing(
        this.state.flashAnim,
        {
          toValue: 0,
          duration: 300
        }
      ).start();

      // Normalise cameraData
      cameraData.path = `file://${cameraData.path}`;
      this.setState({ cameraData: cameraData, isPreviewing: true });
    });
  }

  retakePhoto () {
    this.setState({ cameraData: null, error: null, isSubmitting: false, isPreviewing: false });
  }

  navigateToFeed () {
    const { navigation: { navigate } } = this.props;

    navigate('Newsfeed');
  }

  submitPhoto () {
    const { cameraData } = this.state;
    const upload = store.generateUpload();

    this.setState({ isSubmitting: true, error: null });

    return store.takePhoto(cameraData, upload, {
      camera: this.state.cameraType === RNCamera.constants.Type.front ? CAMERA.FRONT_FACING : CAMERA.BACK_FACING
    }).then(r => {
      if (r.success) {
        this.setState({ error: null, isSubmitting: false });
        this.minimisePreview();
      } else {
        this.setState({ cameraData: null, error: r.message, isSubmitting: false });
      }
    });
  }

  /**
   * Minimise onto feed icon to visualise where the image goes
   */
  minimisePreview () {
    const duration = 750;
    const feedIconMeasures = this.refMeasures['feedIconContainer'];

    Animated.parallel([
      Animated.timing(
        this.state.previewWidthAnim,
        {
          toValue: feedIconMeasures.width,
          duration: duration
        }
      ),
      Animated.timing(
        this.state.previewHeightAnim,
        {
          toValue: feedIconMeasures.height,
          duration: duration
        }
      ),
      Animated.timing(
        this.state.previewTopAnim,
        {
          toValue: feedIconMeasures.pY,
          duration: duration
        }
      ),
      Animated.timing(
        this.state.previewLeftAnim,
        {
          toValue: feedIconMeasures.pX,
          duration: duration,
          easing: Easing.out(Easing.exp)
        }
      ),
      Animated.timing(
        this.state.previewOpacityAnim,
        {
          toValue: 0.5,
          duration: duration
        }
      ),
      Animated.timing(
        this.state.previewRadiusAnim,
        {
          toValue: feedIconMeasures.width / 2,
          duration: duration
        }
      )
    ]).start(({ finished }) => {
      if (finished) {
        this.resetAnims();
        this.setState({ isPreviewing: false, cameraData: null });
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
    const { cameraData } = this.state;

    const animStyles = {
      borderRadius: this.state.previewRadiusAnim,
      width: this.state.previewWidthAnim,
      height: this.state.previewHeightAnim,
      top: this.state.previewTopAnim,
      left: this.state.previewLeftAnim,
      opacity: this.state.previewOpacityAnim
    };

    // Transform is a cheap fix for missing ability to un-mirror front cam,
    // see https://github.com/lwansbrough/react-native-camera/issues/101
    // TODO Fix this via an actual source image transform
    return (
      <Animated.Image
        style={[styles.preview, animStyles, { transform: [ { scaleX: -1 } ] }]}
        source={{uri: cameraData.path}}
      />
    );
  }

  render () {
    const { isSubmitting, isPreviewing } = this.state;
    const { width, height } = Dimensions.get('window');
    const cameraView = this.renderCamera();
    const previewView = (isPreviewing && this.renderPreview());
    const flashView = (
      <Animated.View style={[styles.flash, {opacity: this.state.flashAnim, width: width, height: height}]} />
    );

    // Only show toggle when not isPreviewing
    const toggleView = (!isPreviewing &&
      <Icon
        onPress={(e) => this.toggleType()}
        name='sync'
        size={24}
        reverse
        color='black'
        key='toggle'
      />
    );

    const retakeView = (isPreviewing &&
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
        onPress={(e) => isPreviewing ? this.submitPhoto() : this.takePhoto()}
        isLoading={isSubmitting}
        isReady={isPreviewing && !isSubmitting}
        key='shutter'
      />
    );

    const feedView = (
      <View
        ref='feedIconContainer'
      >
        <Icon
          onPress={(e) => this.navigateToFeed()}
          name='image'
          size={24}
          reverse
          color='black'
          key='image'
        />
      </View>
  );

    // TODO Show error message

    return (
      <View style={styles.container}>
        { cameraView }
        { previewView }
        { flashView }
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
            <View style={styles.toolbarColRight}>
              { feedView }
            </View>
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
  camera: {
    zIndex: 50
  },
  preview: {
    position: 'absolute',
    zIndex: 75
  },
  flash: {
    position: 'absolute',
    zIndex: 90,
    backgroundColor: 'white'
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
