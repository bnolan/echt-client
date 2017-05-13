import React from 'react';
import RNCamera from 'react-native-camera';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from './styles';
import Shutter from '../../components/Shutter';
import store from '../../state/store';
import simulatorUpload from '../../helpers/simulator-upload';

export default class Selfie extends React.Component {
  constructor () {
    super()

    this.state = {
      submitting: false
    };
  }

  submit (path) {
    const { navigation: { navigate } } = this.props;

    store.signup(path).then((r) => {
      this.setState({ submitting: false });

      if (r.success) {
        navigate('Pincode');
      }
    });
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

    return p.then((data) => this.submit(data.path));
  }

  render () {
    return (
      <View style={styles.selfieScreen}>
        <Text style={styles.selfieHeader}>How's your hair?</Text>

        <Text style={styles.selfieText}>Take a selfie</Text>

        <View style={styles.selfieCamera}>
          <RNCamera
            ref={(cam) => { this.camera = cam; }}
            style={{ flex: 1 }}
            captureTarget={RNCamera.constants.CaptureTarget.disk}
            captureQuality={RNCamera.constants.CaptureQuality.high}
            type={RNCamera.constants.Type.front}
            aspect={RNCamera.constants.Aspect.fill}>

            <Shutter onPress={(e) => this.takePhoto()} />
          </RNCamera>
        </View>

        <Text style={styles.selfieTextSmall}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or your phone number.
        </Text>

        { this.state.submitting && <ActivityIndicator /> }
      </View>
    );
  }
}
