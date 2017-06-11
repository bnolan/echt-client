import React from 'react';
import RNCamera from 'react-native-camera';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from './styles';
import Shutter from '../../components/Shutter';
import store from '../../state/store';
import simulatorUpload from '../../helpers/simulator-upload';

export default class Selfie extends React.Component {
  constructor () {
    super();

    this.state = {
      submitting: false,
      error: null
    };
  }

  submit (path) {
    const { navigation: { navigate } } = this.props;

    store.signup(path).then((r) => {
      // this.setState({ submitting: false });

      // if (r.success) {
      //   navigate('Instructions');
      //   // TODO Use PIN screen once it can be made optional
      //   // navigate('Pincode');
      // } else {
      //   this.setState({
      //     error: r.message
      //   });
      // }
    });
  }

  takePhoto () {
    const options = {};
    var p;

    this.setState({ submitting: true });

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
          { this.state.submitting ? 
            <ActivityIndicator 
              animating
              size='large'
              style={{width: 320, height: 320}} /> :
            <RNCamera
              ref={(cam) => { this.camera = cam; }}
              style={{ flex: 1, position: 'relative', zIndex: 100 }}
              captureTarget={RNCamera.constants.CaptureTarget.disk}
              captureQuality={RNCamera.constants.CaptureQuality.high}
              type={RNCamera.constants.Type.front}
              aspect={RNCamera.constants.Aspect.fill}>
            </RNCamera>
          }

          { this.state.submitting || <Shutter onPress={(e) => this.takePhoto()} /> }
        </View>
  
        { this.state.error && <Text style={styles.selfieError}>{this.state.error}</Text>}

        <Text style={styles.selfieTextSmall}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or your phone number.
        </Text>
      </View>
    );
  }
}
