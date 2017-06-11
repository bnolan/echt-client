import mobx from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import store from '../state/store';
import styles from './styles';
import timeago from 'timeago-words'
import { Button } from 'react-native-elements';
import { FlatList, Text, TouchableHighlight, View, Image, Dimensions, StyleSheet } from 'react-native';

export default class Friends extends React.Component {
  state = {
    refreshing: false
  };

  constructor () {
    super();

    this.renderItem = this.renderItem.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh () {
    this.setState({refreshing: true});
    store.refreshFriends()
      .then(() => {
        this.setState({refreshing: false});
      })
      .catch(() => {
        this.setState({refreshing: false});
      });
  }

  renderItem ({item}) {
    const { itemsPerRow, navigation: {navigate} } = this.props;
    const screenWidth = Dimensions.get('window').width;
    const width = 128;
    const height = 128;

    // FIXMEL compute date so that it updates every minute (less than a minute ago,
    // a minute ago, 2 minutes ago, etc...)

    return (
      <View style={styles.friendItem} key={item.uuid}>
        <Image
          style={{width: width, height: height, flex: 0.3}}
          source={{uri: item.photo.small.url}}
        />

        <View style={styles.friendItemDetail}>
          <Text style={styles.headerSmall}>
            Friend Request
          </Text>

          <Text style={styles.friendItemText}>
            {timeago(new Date(item.createdAt))}.
          </Text>

          <View style={styles.friendButtons}>
            <Button 
              fontSize={12}
              backgroundColor='#555'
              color='#fff'
              buttonStyle={styles.friendButton}
              icon={{name: 'check-circle'}}
              title='Accept' />

            <Button 
              fontSize={12}
              backgroundColor='#999'
              color='#ccc'
              buttonStyle={styles.friendButton}
              icon={{name: 'clear'}}
              title='Deny' />
          </View>
        </View>
      </View>
    );

//        <TouchableHighlight onPress={() => navigate('Friend', {uuid: item.uuid})}>
        //</TouchableHighlight>
  }

  keyExtractor (item) {
    return item.uuid;
  }

  get noFriends () {
    return store.friends.length === 0;
  }

  renderEmptyState () {
    return (
      <View style={[styles.container, styles.noFriends]}>
        <Text style={[styles.header, styles.dark]}>You have no friends.</Text>
        <Text style={[styles.paragraph, styles.dark]}>
          Take a selfie with a friend (both of you in the photo
          at the same time) on the front facing camera and we
          will send them a friend request.
        </Text>
      </View>
    );
  }

  render () {
    const friends = mobx.toJS(store.friends);
    const { itemsPerRow } = this.props;
    const refreshing = this.state.refreshing;

    if (this.noFriends) {
      return this.renderEmptyState();
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={friends}
          numColumns={itemsPerRow}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          removeClippedSubviews={false}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  }
}

Friends.PropTypes = {
  itemsPerRow: PropTypes.number
};

Friends.defaultProps = {
  itemsPerRow: 1
};
