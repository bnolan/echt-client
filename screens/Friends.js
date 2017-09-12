import AcceptedFriend from './friends/Accepted';
import mobx from 'mobx';
import SentFriendRequest from './friends/Sent';
import ProposedFriend from './friends/Proposed';
import PropTypes from 'prop-types';
import React from 'react';
import store from '../state/store';
import styles from './styles';
import { FlatList, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { STATUS } from '../constants';

import {
  Body,
  Button,
  Col,
  Content,
  Container,
  Grid,
  Header,
  List,
  Row,
  Text,
  Title
} from 'native-base';

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

  renderItem (item) {
    if (item.status === STATUS.ACCEPTED) {
      return <AcceptedFriend friend={item} key={item.uuid} />;
    } else if (item.status === STATUS.PENDING) {
      return <SentFriendRequest friend={item} key={item.uuid} />;
    } else if (item.status === STATUS.PROPOSED) {
      return <ProposedFriend friend={item} key={item.uuid} />;
    } else {
      throw new Error(`Invalid status for ${JSON.stringify(item)}`);
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
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Friends</Title>
          </Body>
        </Header>

        <Content padder>
          <Text style={styles.lightText}>
            Take a selfie with a friend and we
            will send them a friend request.
          </Text>
        </Content>
      </Container>
    );
  }

  render () {
    const friends = mobx.toJS(store.friends);
    const { itemsPerRow } = this.props;
    const refreshing = this.state.refreshing;

    if (this.noFriends) {
      return this.renderEmptyState();
    }

    console.log(friends);

    const friendCount = friends.filter((f) => f.status === STATUS.ACCEPTED).length;
    const requestCount = friends.length - friendCount;

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>
              {friendCount} Friend{friendCount === 1 ? '' : 's'}
              {requestCount > 0 ? ` and ${requestCount} Request${requestCount === 1 ? '' : 's'}` : ''}
            </Title>
          </Body>
        </Header>

        <Content>
          <List
            dataArray={friends}
            renderRow={this.renderItem}
          />
        </Content>
      </Container>
    );
  }
}

Friends.PropTypes = {
  itemsPerRow: PropTypes.number
};

Friends.defaultProps = {
  itemsPerRow: 1
};
