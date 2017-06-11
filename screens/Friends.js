import AcceptedFriend from './friends/Accepted';
import mobx from 'mobx';
import PendingInvite from './friends/Pending';
import ProposedFriend from './friends/Proposed';
import PropTypes from 'prop-types';
import React from 'react';
import store from '../state/store';
import styles from './styles';
import { FlatList, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { STATUS } from '../constants';

@observer export default class Friends extends React.Component {
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
    if (item.status === STATUS.ACCEPTED) {
      return <AcceptedFriend friend={item} key={item.uuid} />;
    } else if (item.status === STATUS.PENDING) {
      return <PendingInvite friend={item} key={item.uuid} />;
    } else if (item.status === STATUS.PROPOSED) {
      return <ProposedFriend friend={item} key={item.uuid} />;
    }
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
