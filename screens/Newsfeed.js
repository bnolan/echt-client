import React from 'react';
import { Dimensions, FlatList, Image, View, TouchableHighlight } from 'react-native';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import store from '../state/store';
import styles from './styles';

import {
  Body,
  Content,
  Container,
  Header,
  List,
  Text,
  Title
} from 'native-base';

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
            source={{uri: item.small && item.small.url}}
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
    const photos = toJS(store.photos);

    const { itemsPerRow } = this.props;
    const refreshing = this.state.refreshing;

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>{photos.length} Photos</Title>
          </Body>
        </Header>

        <Content style={styles.container}>
          <FlatList
            data={photos}
            numColumns={itemsPerRow}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            removeClippedSubviews={false}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
          />
        </Content>
      </Container>
    );
  }
}

Newsfeed.PropTypes = {
  itemsPerRow: PropTypes.number
};

Newsfeed.defaultProps = {
  itemsPerRow: 3
};
