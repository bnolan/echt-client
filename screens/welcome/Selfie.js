import * as Animatable from 'react-native-animatable';
import React from 'react';
import RNCamera from 'react-native-camera';
import Shutter from '../../components/Shutter';
import simulatorUpload from '../../helpers/simulator-upload';
import store from '../../state/store';
import styles from '../styles';
import { ActivityIndicator, Dimensions, View, Image } from 'react-native';

import {
  Body,
  Button,
  Col,
  Container,
  Grid,
  Header,
  Row,
  Text,
  Title
} from 'native-base';

export default class Selfie extends React.Component {
  constructor () {
    super();

    this.state = {
      submitting: false,
      path: null, // renders preview, used for submission
      error: null,
      showCamera: true
    };
  }

  submitPhoto () {
    const { navigation: { navigate } } = this.props;
    const { path } = this.state;

    this.setState({ submitting: true, error: null });

    store.signup(path).then((r) => {
      console.log('r', r);
      this.setState({ submitting: false });

      if (r.success) {
        this.setState({ path: null, error: null, showCamera: false });

        // Remove camera reference to avoid interference with <Camera> later.
        // See https://github.com/lwansbrough/react-native-camera/issues/642#issuecomment-295402172
        this.camera = null;

        navigate('Instructions');
        // TODO Use PIN screen once it can be made optional
        // navigate('Pincode');
      } else {
        this.setState({ path: null, error: r.message });
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
      // Takes picture in default quality (high),
      // which will be downsampled for a faster initial upload (and face reco).
      // The full captured image will be uploaded in the background
      // without requiring user interaction.
      p = this.camera.capture({ metadata: options });
    }

    return p.then((data) => this.setState({ path: data.path }));
  }

  get width () {
    var { width } = Dimensions.get('window');
    return width - 32;
  }

  renderError () {
    const { error } = this.state;

    if (error) {
      return (
        <View style={styles.selfieErrorBox}>
          <Icon
            name={this.icon}
            color='#000000' />
          <Text style={styles.selfieError}>{this.state.error}</Text>
        </View>
      );
    }
  }

  renderCamera () {
    // Remove camera from view to avoid interference with <Camera> later.
    // This only works because we don't allow navigating back from
    // <Instructions> to <Selfie> - once you've submitted a selfie, that's it.
    // See https://github.com/lwansbrough/react-native-camera/issues/642#issuecomment-295402172
    if (!this.state.showCamera) {
      return null;
    }

    return (
      <Row style={[ styles.margin15, styles.flex0 ]}>
        <RNCamera
          ref={(cam) => { this.camera = cam; }}
          style={{ width: this.width, height: this.width, borderRadius: 4 }}
          captureTarget={RNCamera.constants.CaptureTarget.disk}
          captureQuality={RNCamera.constants.CaptureQuality.high}
          type={RNCamera.constants.Type.front}
          aspect={RNCamera.constants.Aspect.fill} />
      </Row>
    );
  }

  get icon () {
    if (this.state.error) {
      if (this.state.error.match(/too many/i)) {
        return 'group';
      } else if (this.state.error.match(/no face/i)) {
        return 'person-outline';
      } else {
        return 'error';
      }
    }
  }

  renderPreview () {
    const {submitting, path} = this.state;

    var view;

    if (submitting) {
      view = <View
        style={[styles.selfieUploading, {width: this.width}]}>
        <Animatable.Text
          style={styles.selfieUploadingText}
          animation='fadeIn'>
          Uploading...
        </Animatable.Text>
      </View>;
    } else {
      view = <Animatable.View animation='fadeIn' style={[styles.selfiePreviewButtons, {width: this.width}]}>
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
      </Animatable.View>;
    }

    return (
      <View
        style={[styles.selfiePreview, {width: this.width + 2, height: this.width + 32}]}>

        <Image
          style={[styles.selfiePreviewImage, {width: this.width, height: this.width}]}
          source={{uri: path}} />

        { submitting && <ActivityIndicator animating size='large' style={[styles.selfiePreviewActivityIndicator, {width: this.width, height: this.width}]} /> }

        { view }
      </View>
    );
  }

  render () {
    const { path } = this.state;
    const camView = path ? this.renderPreview() : this.renderCamera();

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Take a selfie</Title>
          </Body>
        </Header>

        <Grid>
          <Row style={[ styles.flex0, styles.margin15 ]}>
            <Animatable.Text
              animation='fadeIn'
              delay={250}
              style={styles.text}>
              We use your selfie so that we can find
              you in your friends photos. You don't need
              an email address or phone number to sign up.
            </Animatable.Text>
          </Row>

          { camView }

          <Row>
            { this.renderError() }
          </Row>

          <Row style={styles.margin15}>
            <Button
              block
              onPress={() => this.takePhoto()}>
              <Text>Take Selfie</Text>
            </Button>
          </Row>
        </Grid>
      </Container>
    );
  }
}
