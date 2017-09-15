import * as Animatable from 'react-native-animatable';
import React from 'react';
import RNCamera from 'react-native-camera';
import simulatorUpload from '../../helpers/simulator-upload';
import store from '../../state/store';
import styles, { colors } from '../styles';
import { ActivityIndicator, Dimensions, View, Image, StyleSheet } from 'react-native';

import {
  Body,
  Button,
  Col,
  Container,
  Grid,
  Header,
  Icon,
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

  get icon () {

  }

  renderIntro () {
    return (
      <Row style={[ styles.flex0, styles.margin15 ]}>
        <Animatable.Text
          animation='fadeIn'
          delay={250}
          style={styles.text}>
          We use your selfie to find
          you in your friends' photos. You don't need
          an email address or phone number to sign up.
        </Animatable.Text>
      </Row>
    );
  }

  renderError () {
    const { error } = this.state;
    var icon;

    if (this.state.error) {
      if (this.state.error.match(/too many/i)) {
        icon = 'people';
      } else if (this.state.error.match(/no face/i)) {
        icon = 'contact';
      } else {
        icon = 'alert';
      }
    }

    if (error) {
      return (
        <Row style={[ styles.flex0, styles.margin15 ]}>
          <View style={[ styles.alert, styles.alertDanger ]}>
            <Icon
              name={icon}
              color={colors.btnDangerColor}
            />
            <Text style={styles.alertDangerText}>{this.state.error}</Text>
          </View>
        </Row>
      );
    } else {
      // Native base doesn't like NULLs as rows
      return (
        <Row style={{height: 1}} />
      );
    }
  }

  renderCamera () {
    // Remove camera from view to avoid interference with <Camera> later.
    // This only works because we don't allow navigating back from
    // <Instructions> to <Selfie> - once you've submitted a selfie, that's it.
    // See https://github.com/lwansbrough/react-native-camera/issues/642#issuecomment-295402172
    if (!this.state.showCamera) {
      return <Row style={{height: 1}} />;
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

  renderPreview () {
    const {submitting, path} = this.state;
    const opacity = submitting ? 0.5 : 1.0;

    return (
      <Row style={[ styles.margin15, styles.flex0 ]}>
        <Image
          style={[styles.selfiePreviewImage, {width: this.width, height: this.width, opacity: opacity}]}
          source={{uri: path}}
        />
        { submitting &&
          <ActivityIndicator
            animating size='large'
            style={[componentStyles.activityIndicator, {width: this.width, height: this.width}]}
            color='white'
          />
        }
      </Row>
    );
  }

  renderActions () {
    const {submitting, path} = this.state;

    var view;

    if (submitting) {
      // Native base doesn't like NULLs as rows
      view = (
        <Row style={{height: 1}} />
      );
    } else if (path) {
      view = (
        <Row style={[ styles.margin15, styles.flex0 ]}>
          <Col>
            <Button
              block
              light
              onPress={(e) => this.retakePhoto()}
            >
              <Icon name='refresh' />
              <Text>Retake</Text>
            </Button>
          </Col>
          <Col>
            <Button
              block
              success
              disabled={submitting}
              onPress={(e) => this.submitPhoto()}
            >
              <Icon name='checkmark' />
              <Text>Submit</Text>
            </Button>
          </Col>
        </Row>
      );
    } else {
      view = (
        <Row style={[ styles.margin15, styles.flex0 ]}>
          <Grid>
            <Col>
              <Button
                block
                onPress={() => this.takePhoto()}
              >
                <Icon name='camera' />
                <Text>Take Selfie</Text>
              </Button>
            </Col>
          </Grid>
        </Row>
      );
    }

    return view;
  }

  render () {
    const { path } = this.state;

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Take a selfie</Title>
          </Body>
        </Header>

        <Grid>
          { this.renderIntro() }

          { path ? this.renderPreview() : this.renderCamera() }

          { this.renderError() }

          { this.renderActions() }
        </Grid>
      </Container>
    );
  }
}

const componentStyles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute'
  }
});
