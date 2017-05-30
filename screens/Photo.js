import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PhotoView from 'react-native-photo-view';
import Icon from 'react-native-vector-icons/Ionicons';
import store from '../state/store';

@observer
export default class Photo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {showActions: true};
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  toggleActions () {
    this.setState({showActions: !this.state.showActions});
  }

  handleClose () {
    this.props.navigation.goBack();
  }

  handleDelete () {
    const uuid = this.props.navigation.state.params.uuid;
    store.deletePhoto(uuid).then(r => {
      this.props.navigation.goBack();
    });
  }

  renderTopActions () {
    if (!this.state.showActions) {
      return null;
    }

    return (
      <View style={styles.actionsTop}>
        <TouchableHighlight onPress={this.handleClose}>
          <Icon name='ios-close' size={30} style={styles.icon} />
        </TouchableHighlight>
      </View>
    );
  }

  renderBottomActions () {
    if (!this.state.showActions) {
      return null;
    }

    return (
      <View style={styles.actionsBottom}>
        <TouchableHighlight onPress={this.handleDelete}>
          <Icon name='ios-trash' size={30} style={styles.icon} />
        </TouchableHighlight>
      </View>
    );
  }

  render () {
    const uuid = this.props.navigation.state.params.uuid;
    if (!uuid) {
      return null;
    }

    const {width, height} = Dimensions.get('window');
    const photo = store.getPhoto(uuid);
    if (!photo) {
      return null;
    }

    const topActions = this.renderTopActions();
    const bottomActions = this.renderBottomActions();

    // TODO Proper dimension calc
    return (
      <View>
        <StatusBar hidden />
        <PhotoView
          source={{uri: photo.original.url}}
          minimumZoomScale={1}
          maximumZoomScale={3}
          style={{flex: 1, width: width, height: height}}
          onTap={() => this.toggleActions()}
        />
        {topActions}
        {bottomActions}
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
    backgroundColor: 'black',
    alignItems: 'flex-end'
  },
  actionsTop: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingRight: 20,
    backgroundColor: 'black',
    opacity: 0.7
  },
  actionsBottom: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingRight: 20,
    backgroundColor: 'black',
    opacity: 0.7
  },
  icon: {
    color: 'white'
  }
});
