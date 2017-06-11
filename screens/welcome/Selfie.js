import React from 'react';
import RNCamera from 'react-native-camera';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import Shutter from '../../components/Shutter';
import store from '../../state/store';
import simulatorUpload from '../../helpers/simulator-upload';
import { Icon } from 'react-native-elements';

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
      this.setState({ submitting: false });

      if (r.success) {
        navigate('Instructions');
        // TODO Use PIN screen once it can be made optional
        // navigate('Pincode');
      } else {
        this.setState({
          error: r.message
        });
      }
    });
  }

  takePhoto () {
    const options = {};
    var p;

    this.setState({ submitting: true, error: null });

    // Simulator doesn't support cam
    if (this.props.screenProps.isSimulator) {
      p = simulatorUpload();
    } else {
      p = this.camera.capture({metadata: options});
    }

    return p.then((data) => this.submit(data.path));
  }

  render () {
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

    return (
      <View style={styles.container}>
        <Text style={styles.header}>How's your hair?</Text>

        <Text style={styles.text}>Take a selfie</Text>

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

        { this.state.error && <View style={styles.selfieErrorBox}>
          <Icon
            name={icon}
            color='#ff00aa' />
          <Text style={styles.selfieError}>{this.state.error}</Text>
        </View>}

        <Text style={styles.textSmall}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or your phone number.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8795E8',
    flex: 1
  },
  camera: {
    width: 320,
    height: 320,
    backgroundColor: '#777777',
    margin: 24,
    borderColor: '#ff00aa',
    borderWidth: 1
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  header: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  text: {
    color: '#ffffff',
    margin: 24,
    marginTop: 0,
    fontSize: 18
  },
  textSmall: {
    color: '#eeeeee',
    margin: 24
  }
});
