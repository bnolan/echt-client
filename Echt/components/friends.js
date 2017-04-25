import React from 'react';
import { FlatList, View } from 'react-native';
import Friend from './friend';
import store from '../state/store';

export default class Friends extends React.Component {
  renderItem ({item}) {
    return (<Friend {...item} />);
  }

  keyExtractor (item) {
    return item.uuid;
  }

  render () {
    return (
      <View>
        <FlatList
          data={store.friends}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          horizontal
        />
      </View>
    );
  }
}
