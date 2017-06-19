import React from 'react';
import store from '../../state/store';
import styles, { colors } from '../styles';
import timeago from 'timeago-words';
import { Button } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { STATUS } from '../../constants';

const width = 128;
const height = 128;

export default class ProposedFriend extends React.Component {
  onAccept () {
    // The store will remove the invite from the list, be good
    // to animate to a 'accepting...' state, then update
    store.acceptFriendRequest(this.props.friend.uuid);
  }

  get photo () {
    return this.props.friend.photo.small.url;
  }

  render () {
    const createdAt = new Date(this.props.friend.updatedAt || this.props.friend.createdAt);

    return (
      <View style={styles.friendItem}>
        <Image
          style={{width: width, height: height, flex: 0.4}}
          source={{uri: this.photo}}
        />

        <View style={styles.friendItemDetail}>
          <Text style={styles.headerSmall}>
            Friend request
          </Text>

          <Text style={styles.friendItemText}>
            Recieved {timeago(createdAt)}.
          </Text>

          <View style={styles.friendButtons}>
            { this.props.friend.status === STATUS.PENDING && <Button
              onPress={() => this.onAccept()}
              fontSize={12}
              backgroundColor={colors.bgPink}
              color={colors.textWhite}
              buttonStyle={styles.friendButton}
              icon={{name: 'check-circle'}}
              title='Accept' /> }
          </View>
        </View>
      </View>
    );
  }
}
