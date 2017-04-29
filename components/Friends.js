import React from 'react';
import { FlatList, TouchableHighlight, View, Image, Dimensions, StyleSheet } from 'react-native';
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

  render () {
    const friends = store.friends;
    const { itemsPerRow } = this.props;
    const refreshing = this.state.refreshing;
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
  }
});
