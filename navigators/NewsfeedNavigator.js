import { StackNavigator } from 'react-navigation';
import Newsfeed from '../screens/Newsfeed';

export default StackNavigator({
  NewsfeedMain: {
    screen: Newsfeed
  },
  NewsfeedPhoto: {
    screen: Newsfeed,
    path: 'photo/:uuid',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
