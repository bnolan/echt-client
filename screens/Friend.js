import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import PhotoView from 'react-native-photo-view';
import store from '../state/store';
import styles from './styles';

@observer
export default class Friend extends React.Component {
  render () {
    const uuid = this.props.navigation.state.params.uuid;
    if (!uuid) {
      return null;
    }

    const { navigation: {goBack} } = this.props;
    const screenWidth = Dimensions.get('window').width;
    const friend = store.getFriend(uuid);

    // TODO Proper dimension calc
    return (
      <View style={[styles.container, styles.friendScreen]}>
        <PhotoView
          source={{uri: friend.photo.original.url}}
          minimumZoomScale={1}
          maximumZoomScale={3}
          style={{width: screenWidth, height: screenWidth}}
          onTap={() => goBack()}
        />
      </View>
    );
  }
}

Friend.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string
      })
    })
  })
};
