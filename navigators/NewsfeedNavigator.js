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
      headerMode: 'screen',
      // Avoid switching to the next tab state
      // See https://github.com/react-community/react-navigation/issues/1760#issuecomment-336521248
      gesturesEnabled: false
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
