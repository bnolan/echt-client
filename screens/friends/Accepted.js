import React from 'react';
import strftime from 'strftime';
import styles from '../styles';
import { TouchableHighlight, View, Image } from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body
} from 'native-base';

const width = 128;
const height = 128;

export default class Friends extends React.Component {
  get photo () {
    return this.props.friend.photo && this.props.friend.photo.small.url;
  }

  // get photoCount () {
  //   // todo
  //   return 3;
  // }

  get name () {
    return this.props.friend.name || 'Friend';
  }

  get time () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);
    return 'Friend since ' + strftime('%B %Y', createdAt);
  }

  onPress () {
    const { navigation: { navigate } } = this.props;
    navigate('Friend', { uuid: this.props.friend.uuid });
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
      </ListItem>
    );
  }
}
