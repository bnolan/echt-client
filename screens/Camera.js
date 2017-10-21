import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../components/Shutter';
import simulatorUpload from '../helpers/simulator-upload';
import store from '../state/store';
import { CAMERA } from '../constants';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Animated, Easing, Dimensions, StyleSheet, View, findNodeHandle, Text } from 'react-native';
import PopupDialog, { SlideAnimation, DialogTitle, DialogButton } from 'react-native-popup-dialog';
const UIManager = require('NativeModules').UIManager;

@observer export default class Camera extends React.Component {
  constructor () {
    super();

    this.refsToMeasure = ['feedIconContainer'];
    this.refMeasures = {};

    this.state = {
      isPreviewing: false,
      isSubmitting: false,
      error: null,
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

  handleShutterPress () {
    const { isPreviewing, isSubmitting } = this.state;

    if (isSubmitting) return;

    if (isPreviewing && !store.user.loggedIn) {
      this.signup();
    } else if (isPreviewing) {
      this.submitPhoto();
    } else {
      this.takePhoto();
    }
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
      p = this.refs.camera.capture({metadata: options});
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
        this.setState({ error: null, isSubmitting: false }); // keep preview for minimizing
        setTimeout(this.minimisePreview.bind(this), 50); // delay minimise to ensure feedIconContainer is available
      } else {
        this.setState({ cameraData: null, error: r.message, isSubmitting: false, isPreviewing: false });
        this.refs.dialog.show();
      }
    });
  }

  signup () {
    const { navigation: { navigate } } = this.props;
    const { cameraData } = this.state;

    this.setState({ isSubmitting: true, error: null });

    return store.signup(cameraData.path).then(r => {
      if (r.success) {
        this.setState({ cameraData: null, error: null, isSubmitting: false, isPreviewing: false });

        navigate('Instructions');
      } else {
        this.setState({ cameraData: null, error: r.message, isSubmitting: false, isPreviewing: false });
        this.refs.dialog.show();
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
        ref='camera'
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

  renderError () {
    const { error } = this.state;
    const { width } = Dimensions.get('window');

    return (
      <PopupDialog
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        onDismissed={() => {
          this.setState({error: null});
        }}
        ref='dialog'
        style={styles.dialog}
        width={width - 40}
        dialogTitle={<DialogTitle title='Something went wrong' />}
        actions={[
          <DialogButton text='Close' key='dialogButtonClose' onPress={() => { this.refs.dialog.dismiss(); }} />
        ]}
      >
        <View style={styles.dialogContentView}>
          <Text>{error}</Text>
        </View>
      </PopupDialog>
    );
  }

  render () {
    const { isSubmitting, isPreviewing } = this.state;
    const loggedIn = store.user.loggedIn;
    const { width, height } = Dimensions.get('window');
    const cameraView = this.renderCamera();
    const previewView = (isPreviewing && this.renderPreview());
    const flashView = (
      <Animated.View style={[styles.flash, {opacity: this.state.flashAnim, width: width, height: height}]} />
    );
    const errorView = this.renderError();

    // Hide this during preview and signup (where we only want selfies)
    const toggleView = (!isPreviewing && loggedIn &&
      <Icon
        onPress={(e) => this.toggleType()}
        name='sync'
        size={24}
        reverse
        color='black'
        key='toggle'
      />
    );

    const retakeView = (isPreviewing && !isSubmitting &&
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
        onPress={(e) => this.handleShutterPress()}
        isLoading={isSubmitting}
        isReady={isPreviewing && !isSubmitting}
        key='shutter'
      />
    );

    // Don't show this option durign signup
    const feedView = (loggedIn && !isPreviewing &&
      <View
        ref='feedIconContainer'
        onLayout={() => this.measureRefs()}
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
        { errorView }
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
  dialog: {
    position: 'absolute',
    zIndex: 500,
    backgroundColor: 'green'
  },
  dialogContentView: {
    flex: 1,
    padding: 20
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
