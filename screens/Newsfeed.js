import React from 'react';
import { observer } from 'mobx-react/native';
import mobx from 'mobx';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';

import store from '../state/store';
import styles from './styles';

@observer
export default class Newsfeed extends React.Component {
  state = {
    refreshing: false
  };

  constructor () {
    super();

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleGridPhotoTap = this.handleGridPhotoTap.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleRefresh () {
    this.setState({refreshing: true});
    store.refreshPhotos()
      .then(() => {
        this.setState({refreshing: false});
      })
      .catch(() => {
        this.setState({refreshing: false});
      });
  }

  handleBack () {
    const { navigate } = this.props.navigation;
    navigate('NewsfeedMain');
  }

  handleGridPhotoTap (index) {
    const { navigate } = this.props.navigation;
    console.log('index', index);
    const uuid = this.getUuidForIndex(index);
    console.log('uuid', uuid);
    navigate('NewsfeedPhoto', {uuid: uuid});
  }

  getUuidForIndex (index) {
    const photo = store.photos[index];
    console.log('photo', photo);
    return photo ? photo.get('uuid') : null;
  }

  getIndexForUuid (uuid) {
    return store.photos.findIndex(photo => photo.get('uuid') === uuid);
  }

  render () {
    const params = this.props.navigation.state.params;
    const uuid = params ? params.uuid : null;
    const index = uuid ? this.getIndexForUuid(uuid) : null;
    const currentIndex = (uuid && index >= 0) ? index : 0;

    console.log('render uuid', uuid);
    console.log('render index', index);

    const media = store.photos.map((photoMap, index) => {
      const photo = mobx.toJS(photoMap);
      return {
        thumb: photo.small && photo.small.url,
        photo: photo.original.url
      };
    });

    // TODO Reimplement refresh

    return (
      <PhotoBrowser
        startOnGrid={(uuid === null)}
        mediaList={media}
        onBack={this.handleBack}
        onGridPhotoTap={this.handleGridPhotoTap}
        displayTopBar={false}
        initialIndex={currentIndex}
        useCircleProgressiOS
        style={localStyles.photoBrowser}
      />
    );
  }
}

Newsfeed.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string
      })
    })
  })
};

const localStyles = StyleSheet.create({
  photoBrowser: {
    backgroundColor: 'black'
  }
});
