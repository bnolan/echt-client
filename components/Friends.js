import React from 'react';
import { FlatList, Text, TouchableHighlight, View, Image, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import store from '../state/store';

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
    const width = (screenWidth / itemsPerRow);
    const height = width;

    return (
      <View style={styles.item} key={item.uuid}>
        <TouchableHighlight onPress={() => navigate('Friend', {uuid: item.uuid})}>
          <Image
            style={{width: width, height: height}}
            source={{uri: item.photo.small.url}}
          />
        </TouchableHighlight>
      </View>
    );
  }

  keyExtractor (item) {
    return item.uuid;
  }

  get noFriends () {
    return store.friends.length === 0;
  }

  renderEmptyState () {
    return (
      <View style={styles.noFriends}>
        <Text style={styles.paragraph}>You have no friends yet</Text>
        
        <Text style={styles.bigEmoji}>😨</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>To add a friend:</Text>

          Take a selfie with a friend (both of you in the photo
          at the same time) on the front facing camera and we
          will send them a friend request.
        </Text>
      </View>
    );
  }

  render () {
    const friends = store.friends;
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
  itemsPerRow: 3
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noFriends: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white'
  },
  bigEmoji: {
    fontSize: 48,
    margin: 20,
    height: 60,
    textAlign: 'center'
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 24,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold'
  }
});
