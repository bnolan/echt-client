import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import PhotoView from 'react-native-photo-view';
import store from '../state/store';
import styles from './styles';

@observer
export default class InviteFriend extends React.Component {
  constructor () {
    super()

    console.log('#InviteFriend#ctor');
  }

  onSend (e) {
  }

  onClose (e) {
    const { navigation: {goBack} } = this.props;

    // Go back to the camera?
    goBack();
  }

  render () {
    const uuid = this.props.navigation.state.params.uuid;
    const photo = store.getPhoto(uuid);
    const action = photo.actions[0];
    const width = 92;
    const height = 92;

    // TODO Proper dimension calc
    return (
      <View style={styles.container}>
        <Text>
          Do you want to add this person as a friend? Their
          UUID is {action.user.uuid}.
        </Text>

        <Image
          style={{width: width, height: height}}
          source={{uri: action.user.avatar}}
        />

        <Image
          style={{width: width, height: height}}
          source={{uri: photo.small.url}}
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
