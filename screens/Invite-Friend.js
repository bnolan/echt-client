import _ from 'lodash';
import assert from 'assert';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import store from '../state/store';
import styles from './styles';
import { observer } from 'mobx-react/native';
import { Image } from 'react-native';

import {
  Body,
  Button,
  Card,
  CardItem,
  Col,
  Container,
  Grid,
  Header,
  Left,
  Row,
  Text,
  Title
} from 'native-base';

@observer
export default class InviteFriend extends React.Component {
  constructor () {
    super();
    console.log('#InviteFriend#ctor');
  }

  get uuid () {
    return this.props.navigation.state.params.uuid;
  }

  get upload () {
    return toJS(store.getUpload(this.uuid));
  }

  get action () {
    return _.first(this.upload.actions);
  }

  goBack () {
    const { navigation: {goBack} } = this.props;
    goBack();
  }

  onSend (e) {
    // FIXME - show spinner as request happens?
    store.sendFriendRequest(this.action.user.uuid, this.upload.uuid);
    this.goBack();
  }

  onClose (e) {
    // FIXME - navigate to camera?
    this.goBack();
  }

  render () {
    assert(this.upload, 'Upload does not exist');

    // TODO Proper dimension calc

    /*
      <Row style={styles.m15}>
        <Text color='0x777777'>
          Do you want to send a friend invite to this person?
        </Text>
      </Row>
    */

//        <Content style={styles.container}>

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Add friend</Title>
          </Body>
        </Header>

        <Grid>
          <Row style={[ styles.margin15, styles.flex0 ]}>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>Ingo</Text>
                    <Text note>Joined May 2017</Text>
                  </Body>
                </Left>
              </CardItem>

              <CardItem cardBody>
                <Image
                  style={{
                    resizeMode: 'cover',
                    width: null,
                    height: 320,
                    flex: 1
                  }}
                  source={{ uri: this.action.user.avatar }}
                />
              </CardItem>
            </Card>
          </Row>

          <Row />

          <Row style={styles.flex0}>
            <Grid style={styles.margin10}>
              <Col style={styles.mr5}>
                <Button block bordered onPress={this.onClose.bind(this)}>
                  <Text>Cancel</Text>
                </Button>
              </Col>
              <Col style={styles.ml5}>
                <Button block onPress={this.onSend.bind(this)}>
                  <Text>Send Invite</Text>
                </Button>
              </Col>
            </Grid>
          </Row>
        </Grid>
      </Container>
    );

    /*
      <View style={styles.container}>
        <View style={[styles.headerView]}>
          <Icon
            name='sentiment-satisfied'
            size={48}
            color='#ffffff'
          />

          <Text style={[styles.header, styles.text]}>
            Add friend?
          </Text>
        </View>

        <Text style={[styles.text, styles.dark]}>
          Do you want to send a friend invite to this person? Their
          UUID is {this.action.user.uuid}.
        </Text>

        <Image
          style={{width: width, height: height}}
          source={{uri: this.action.user.avatar}}
        />

        <Image
          style={{width: width, height: height}}
          source={{uri: this.upload.url}}
        />

        <Button onPress={this.onSend.bind(this)} title='Send Invite' />
        <Button onPress={this.onClose.bind(this)} title='Close' />
      </View>
    */
  }
}

InviteFriend.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string
      })
    })
  })
};
