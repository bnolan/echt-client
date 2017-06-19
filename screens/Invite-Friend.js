import _ from 'lodash';
import assert from 'assert';
import mobx from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import store from '../state/store';
import styles from './styles';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Text, Image, View } from 'react-native';

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
    return mobx.toJS(store.getUpload(this.uuid));
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

    const width = 128;
    const height = 128;

    // TODO Proper dimension calc
    return (
      <View style={styles.container}>
        <Text style={[styles.header, styles.dark]}>
          Add friend?
        </Text>

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
    );
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
