import { StackNavigator } from 'react-navigation';
import Friends from '../screens/Friends';
import Friend from '../screens/Friend';
import InviteFriend from '../screens/Invite-Friend';

export default StackNavigator({
  Main: {
    screen: Friends
  },
  Friend: {
    screen: Friend,
    path: 'friend/:uuid',
    navigationOptions: {
      headerMode: 'screen',
      // Avoid switching to the next tab state
      // See https://github.com/react-community/react-navigation/issues/1760#issuecomment-336521248
      swipeEnabled: false
    }
  },
  InviteFriend: {
    screen: InviteFriend,
    path: 'friend/new/:uuid'
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
