import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

export default class Friend extends React.Component {
  render () {
    const props = this.props;
    return (
      <View>
        <Image
          style={{width: 120, height: 120}}
          source={{uri: props.photo.small.url}}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

Friend.propTypes = {
  uuid: PropTypes.string,
  createdAt: PropTypes.string,
  name: PropTypes.string,
  photo: PropTypes.shape({
    small: PropTypes.shape({
      url: PropTypes.string
    })
  })
};
