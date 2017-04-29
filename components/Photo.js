import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import PhotoView from 'react-native-photo-view';
import store from '../state/store';

@observer
export default class Photo extends React.Component {
  render () {
    const uuid = this.props.navigation.state.params.uuid;
    if (!uuid) {
      return null;
    }

    const screenWidth = Dimensions.get('window').width;
    const photo = store.getPhoto(uuid);

    // TODO Proper dimension calc
    return (
      <View style={styles.container}>
        <PhotoView
          source={{uri: photo.original.url}}
          minimumZoomScale={1}
          maximumZoomScale={3}
          style={{width: screenWidth, height: screenWidth}}
        />
      </View>
    );
  }
}

Photo.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string
      })
    })
  })
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});
