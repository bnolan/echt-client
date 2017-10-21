import React from 'react';
import store from '../../state/store';
import timeago from 'timeago-words';

import {
  Button,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body
} from 'native-base';

/*
 * Proposed means a friend request that's been sent to you and
 * is waiting for you to accept (or deny). This naming scheme
 * is super dumb.
 */

export default class ProposedFriend extends React.Component {
  onAccept () {
    // The store will remove the invite from the list, be good
    // to animate to a 'accepting...' state, then update
    store.acceptFriendRequest(this.props.friend.uuid);
  }

  get photo () {
    return this.props.friend.photo && this.props.friend.photo.small.url;
  }

  get name () {
    return 'Friend request';
  }

  get time () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);
    return 'Recieved ' + timeago(createdAt);
  }

  render () {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail small source={{uri: this.photo}} />
        </Left>
        <Body>
          <Text>{this.name}</Text>
          <Text numberOfLines={1} note>{this.time}</Text>
        </Body>
        <Right>
          <Button bordered small onPress={() => this.onAccept()}>
            <Text>Accept</Text>
          </Button>
        </Right>
      </ListItem>
    );
  }
}
