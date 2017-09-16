import React from 'react';
import store from '../../state/store';
import styles from '../styles';

import {
  Body,
  Title,
  Text,
  Icon,
  Container,
  Header,
  Content,
  Button
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
        <Content style={styles.padding15}>
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
          <Button
            block
            primary
            onPress={() => this.finishSignup()}
          >
            <Icon name='arrow-dropright' />
            <Text>Start</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
