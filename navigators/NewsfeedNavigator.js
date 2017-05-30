import { StackNavigator } from 'react-navigation';
import Photo from '../screens/Photo';
import Newsfeed from '../screens/Newsfeed';

export default StackNavigator({
  Main: {
    screen: Newsfeed
  },
  Photo: {
    screen: Photo,
    path: 'photo/:uuid',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
