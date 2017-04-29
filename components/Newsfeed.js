import React from 'react';
import { Dimensions, FlatList, StyleSheet, Image, View, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import store from '../state/store';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

@observer
export default class Newsfeed extends React.Component {
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
    store.refreshPhotos()
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
        <TouchableHighlight onPress={() => navigate('Photo', {uuid: item.uuid})}>
          <Image
            style={{width: width, height: height}}
            source={{uri: item.small.url}}
          />
        </TouchableHighlight>
      </View>
    );
  }

  keyExtractor (item) {
    return item.uuid;
  }

  render () {
    // Prevent stupid flatlist getting photos[n+1]
    // and mobx goes waaah.
    const photos = store.photos.slice();

    const { itemsPerRow } = this.props;
    const refreshing = this.state.refreshing;

    return (
      <View style={styles.container}>
        <FlatList
          data={photos}
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

Newsfeed.PropTypes = {
  itemsPerRow: PropTypes.number
};

Newsfeed.defaultProps = {
  itemsPerRow: 3
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
