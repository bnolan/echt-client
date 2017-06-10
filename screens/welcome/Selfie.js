import React from 'react';
import RNCamera from 'react-native-camera';
import { StyleSheet, ActivityIndicator, Text, View, Image } from 'react-native';
import Shutter from '../../components/Shutter';
import store from '../../state/store';
import simulatorUpload from '../../helpers/simulator-upload';

export default class Selfie extends React.Component {
  constructor () {
    super();

    this.initialState = {
      submitting: false,
      previewPath: null,
      success: null,
      message: null
    };

    this.state = {...this.initialState};
  }

  submit (path) {
    const { navigation: { navigate } } = this.props;

    this.setState({ submitting: true, previewPath: path });
    store.signup(path)
      .then(r => {
        this.setState(this.initialState);

        if (r.success) {
          navigate('Instructions');
          // TODO Use PIN screen once it can be made optional
          // navigate('Pincode');
        } else {
          this.setState({
            ...this.initialState,
            success: r.success,
            message: r.message
          });
        }
      })
      .catch(e => {
        console.log('e', e);
        this.setState(this.initialState);
      });
  }

  retake () {
    this.setState(this.initialState);
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
    const { submitting, previewPath } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>How's your hair?</Text>

        <Text style={styles.text}>Take a selfie</Text>

        {submitting &&
        <Image style={styles.camera} source={{uri: previewPath}} />
        }

        {!submitting &&
        <View style={styles.camera}>
          <RNCamera
            ref={(cam) => { this.camera = cam; }}
            style={styles.preview}
            captureTarget={RNCamera.constants.CaptureTarget.disk}
            captureQuality={RNCamera.constants.CaptureQuality.high}
            type={RNCamera.constants.Type.front}
            aspect={RNCamera.constants.Aspect.fill} />
          <Shutter onPress={(e) => this.takePhoto()} />
        </View>
        }

        <Text style={styles.textSmall}>
          Echt remembers your face to recognize you, so you don't have
          to enter your email or your phone number.
        </Text>

        { this.state.submitting && <ActivityIndicator /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8795E8'
  },
  preview: {
    flex: 1,
    position: 'relative',
    zIndex: 100
  },
  camera: {
    width: 320,
    height: 320,
    backgroundColor: '#777777',
    margin: 24,
    borderColor: '#ff00aa',
    borderWidth: 1
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
