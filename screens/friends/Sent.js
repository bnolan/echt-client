import React from 'react';
import timeago from 'timeago-words';

import {
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body
} from 'native-base';

/*
 * fucking naming conventions. Pending means this is a friend request
 * you've sent to someone else and it's pending their acceptance.
 */

export default class SentFriendRequest extends React.Component {
  get photo () {
    return this.props.friend.photo.small.url;
  }

  get name () {
    return 'Request sent';
  }

  render () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);

    // FIXMEL compute date so that it updates every minute (less than a minute ago,
    // a minute ago, 2 minutes ago, etc...)

    return (
      <ListItem avatar>
        <Left>
          <Thumbnail small source={{uri: this.photo}} />
        </Left>
        <Body>
          <Text>{this.name}</Text>
          <Text numberOfLines={1} note>Sent {timeago(createdAt)}</Text>
        </Body>
        <Right />
      </ListItem>
    );
  }
}
