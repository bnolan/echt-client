import React from 'react';
import { Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class Friend extends React.Component {
  render () {
    const props = this.props;
    const since = moment(props.createdAt).format('MMMM \'YY');
    return (
      <View>
        <Image
          style={{width: 120, height: 120}}
          source={{uri: props.photo.small.url}}
        />
        {props.name && <Text>{props.name}</Text>}
        <Text>{since}</Text>
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
