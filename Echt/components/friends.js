import React from 'react';
import { FlatList, View, Image, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import store from '../state/store';

export default class Friends extends React.Component {
  constructor () {
    super();

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem ({item}) {
    const { itemsPerRow } = this.props;
    const screenWidth = Dimensions.get('window').width;
    const width = (screenWidth / itemsPerRow);
    const height = width;

    return (
      <Image
        style={{width: width, height: height}}
        source={{uri: item.photo.small.url}}
      />
    );
  }

  keyExtractor (item) {
    return item.uuid;
  }

  render () {
    const friends = store.friends;
    const { itemsPerRow } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={friends}
          numColumns={itemsPerRow}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          removeClippedSubviews={false}
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
