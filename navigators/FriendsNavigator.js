import { StackNavigator } from 'react-navigation';
import Friends from '../screens/Friends';
import Friend from '../screens/Friend';

export default StackNavigator({
  Main: {
    screen: Friends
  },
  Friend: {
    screen: Friend,
    path: 'friend/:uuid',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
