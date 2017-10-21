import React from 'react';
import * as Animatable from 'react-native-animatable';
import store from '../../state/store';
import styles from '../styles';

import {
  Body,
  Title,
  Text,
  Icon,
  Container,
  Header,
  Col,
  Button,
  Grid,
  Row
} from 'native-base';

export default class Instructions extends React.Component {
  finishSignup () {
    const { navigation: { goBack } } = this.props;

    store.user.loggedIn = true;
    store.save();

    // You can never come back heres, harrrr!
    goBack();
  }

  render () {
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Turn a selfie into a friend</Title>
          </Body>
        </Header>
        <Grid>
          <Row style={[styles.margin15, {flexDirection: 'column'}]}>
            <Text style={styles.textParagraph}>
              Your friends see
              photos you take in Echt.
            </Text>
            <Text style={styles.textParagraph}>
              To add a friend, switch to the front facing camera
              and take a selfie with your friend.
            </Text>
            <Text style={styles.textParagraph}>
              Echt will recognize your friend
              and send them a friend request.
            </Text>
            <Text style={styles.textParagraph}>
              If your friend doesn't use Echt, you send
              them an invitation, and when they sign up, we'll
              add them.
            </Text>
          </Row>

          <Row style={[ styles.margin15, styles.flex0 ]}>
            <Grid>
              <Col>
                <Animatable.View
                  style={styles.container}
                  animation='fadeIn'
                  delay={500}>
                  <Button
                    block
                    primary
                    onPress={() => this.finishSignup()}
                  >
                    <Icon name='arrow-dropright' />
                    <Text>Start</Text>
                  </Button>
                </Animatable.View>
              </Col>
            </Grid>
          </Row>
        </Grid>
      </Container>
    );
  }
}
