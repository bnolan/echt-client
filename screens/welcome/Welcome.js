import * as Animatable from 'react-native-animatable';
import React from 'react';
import styles, {colors} from '../styles';
import { View } from 'react-native';
import store from '../../state/store';

import {
  Body,
  Button,
  Card,
  CardItem, 
  Col,
  Container,
  Content,
  Grid,
  Header,
  Icon,
  Left,
  Right,
  Row,
  Text,
  Thumbnail,
  Title
} from 'native-base';
class Welcome extends React.Component {
  nextScreen () {

  }
  render () {
    const { navigation: { navigate } } = this.props;

    // For #loadFixture
    store.navigation = this.props.navigation;

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Welcome</Title>
          </Body>
        </Header>

        <Grid>
          <Row style={styles.margin15}>
            <Animatable.Text
              style={styles.text}
              animation='fadeIn'
              delay={250}>
              Welcome to the photo sharing app
              for friends. Take selfies to add
              your friends.
            </Animatable.Text>
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
                    onPress={() => navigate('Selfie')}>
                    <Text>Begin</Text>
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

export default Welcome;
