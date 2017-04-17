import React from 'react';
import { AsyncStorage, StyleSheet, FlatList, Text, View } from 'react-native';
import Friend from './friend';
import config from '../config';

export default class Friends extends React.Component {

  constructor () {
    super();

    this.state = {
      friends: []
    };
  }

  componentDidMount () {
    this.reload();
  }

  reload () {
    AsyncStorage.getItem('deviceKey')
      .then((key) => {
        // No user registered yet
        if (!key) {
          return Promise.resolve();
        }

        return fetch(`${config.endpoint.uat}/friends`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'x-devicekey': key
          }
        }).then(
          (response) => response.json()
        ).then((r) => {
          this.setState({
            friends: r.friends || []
          });
        });
      });
  }

  renderItem({item}) {
    return (<Friend {...item} />);
  }

  keyExtractor(item) {
    return item.uuid;
  }

  render () {
    return (
      <View>
        <FlatList
          data={this.state.friends}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          horizontal={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
