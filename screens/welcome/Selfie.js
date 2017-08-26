import * as Animatable from 'react-native-animatable';
import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../../components/Shutter';
import simulatorUpload from '../../helpers/simulator-upload';
import store from '../../state/store';
import styles, { colors } from '../styles';
import { ActivityIndicator, Dimensions, Text, View, Image } from 'react-native';
import { Icon, Button } from 'react-native-elements';

export default class Selfie extends React.Component {
  constructor () {
    super();

    this.state = {
      submitting: false,
      path: null, // renders preview, used for submission
      error: null
    };
  }

  submitPhoto () {
    const { navigation: { navigate } } = this.props;
    const { path } = this.state;

    this.setState({ submitting: true, error: null });
    console.log('path', path);
    store.signup(path).then((r) => {
      console.log('r', r);
      this.setState({ submitting: false });

      if (r.success) {
        this.setState({ path: null, error: null });
        navigate('Instructions');
        // TODO Use PIN screen once it can be made optional
        // navigate('Pincode');
      } else {
        this.setState({ error: r.message });
      }
    });
  }

  retakePhoto () {
    this.setState({ path: null, error: null, submitting: false });
  }

  takePhoto () {
    const options = {};
    var p;

    this.setState({ error: null });

    // Simulator doesn't support cam
    if (this.props.screenProps.isSimulator) {
      p = simulatorUpload();
    } else {
      p = this.camera.capture({ metadata: options });
    }

    return p.then((data) => this.setState({ path: data.path }));
  }

  renderCamera () {
    var { height, width } = Dimensions.get('window');

    width -= 50;
    height = width;

    return (
      <Animatable.View
        animation='fadeIn'
        delay={500}
        style={[styles.selfieCameraContainer, {width: width + 2, height: height + 2}]}>
        <RNCamera
          ref={(cam) => { this.camera = cam; }}
          style={[styles.selfieCamera, {width, height}]}
          captureTarget={RNCamera.constants.CaptureTarget.disk}
          captureQuality={RNCamera.constants.CaptureQuality.high}
          type={RNCamera.constants.Type.front}
          aspect={RNCamera.constants.Aspect.fill} />
        <Shutter onPress={(e) => this.takePhoto()} />
      </Animatable.View>
    );
  }

  renderPreview () {
    const {submitting, path} = this.state;
    return (
      <View style={styles.selfiePreview}>
        <Image style={styles.selfiePreviewImage} source={{uri: path}} />
        { submitting && (
        <ActivityIndicator
          animating
          size='large'
          style={styles.selfiePreviewActivityIndicator} />
        )}
        <View style={styles.selfiePreviewButtons}>
          <Button
            title='Retake'
            color={colors.textDark}
            backgroundColor={colors.bgLight}
            icon={{name: 'camera-alt', color: colors.textDark}}
            style={styles.selfiePreviewButton}
            buttonStyle={styles.selfiePreviewButton}
            onPress={(e) => this.retakePhoto()}
          />
          <Button
            title='Submit'
            color={colors.textDark}
            backgroundColor={colors.bgLight}
            icon={{name: 'done', color: colors.textDark}}
            style={styles.selfiePreviewButton}
            buttonStyle={styles.selfiePreviewButton}
            disabled={submitting}
            onPress={(e) => this.submitPhoto()}
          />
        </View>
      </View>
    );
  }

  render () {
    const { submitting, path, error } = this.state;

    var icon;
    if (this.state.error) {
      if (this.state.error.match(/too many/i)) {
        icon = 'group';
      } else if (this.state.error.match(/no face/i)) {
        icon = 'person-outline';
      } else {
        icon = 'error';
      }
    }

    const camView = path ? this.renderPreview() : this.renderCamera();

    return (
      <View style={[styles.container, styles.selfieScreen]}>
        <Animatable.Text
          animation='fadeInUp'
          style={styles.header}>
          Take a selfie
        </Animatable.Text>

        <Animatable.Text 
          animation='fadeIn'
          delay={250}
          style={styles.text}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or phone number.
        </Animatable.Text>

        { camView }

        { submitting && <Text style={styles.text}>Uploading selfie...</Text> }

        { error && <View style={styles.selfieErrorBox}>
          <Icon
            name={icon}
            color='#000000' />
          <Text style={styles.selfieError}>{this.state.error}</Text>
        </View>}
      </View>
    );
  }
}
