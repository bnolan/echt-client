import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, TouchableHighlight, Image, StatusBar, StyleSheet, Alert } from 'react-native';
import mobx from 'mobx';
import { observer } from 'mobx-react/native';
import PhotoView from 'react-native-photo-view';
import { Button, Text, Icon } from 'native-base';
import store from '../state/store';

@observer
export default class Photo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {showActions: false};
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  toggleActions () {
    this.setState({showActions: !this.state.showActions});
  }

  deletePhoto () {
    const uuid = this.props.navigation.state.params.uuid;
    store.deletePhoto(uuid).then(r => {
      // TODO Deferred deletion once we've got a loading indicator
      // this.props.navigation.goBack();
    });
    this.props.navigation.goBack();
  }

  handleClose () {
    this.props.navigation.goBack();
  }

  handleDelete () {
    Alert.alert(
      'Delete photo',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.deletePhoto()}
      ]
    );
  }

  renderPhotoView (photo) {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <PhotoView
          source={{uri: photo.original.url}}
          minimumZoomScale={1}
          maximumZoomScale={3}
          style={{flex: 1, width: width, height: height}}
          onTap={() => this.toggleActions()}
        />
      </View>
    );
  }

  renderEditView (photo) {
    const actions = [
      <Button
        full
        danger
        onPress={this.handleDelete}
        key='delete'
      >
        <Icon name='trash' />
        <Text>Delete</Text>
      </Button>
    ];

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <TouchableHighlight
          onPress={() => this.toggleActions()}
          style={[styles.previewContainer]}
        >
          <Image
            source={{uri: photo.original.url}}
            style={[styles.preview]}
          />
        </TouchableHighlight>
        <View style={[styles.actions]}>
          {actions}
        </View>
      </View>
    );
  }

  render () {
    const uuid = this.props.navigation.state.params.uuid;
    const { showActions } = this.state;

    if (!uuid) {
      return null;
    }

    var photo = store.getPhoto(uuid);
    if (!photo) {
      return null;
    }
    photo = mobx.toJS(photo);

    if (showActions) {
      return this.renderEditView(photo);
    } else {
      return this.renderPhotoView(photo);
    }
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
  },
  previewContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-start',
    margin: 10
  },
  preview: {
    flex: 1,
    borderRadius: 10
  },
  actions: {
    margin: 10
  }
});
