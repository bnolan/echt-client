import { StackNavigator } from 'react-navigation';
import WelcomeScreen from '../screens/welcome/Welcome';

export default StackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    path: 'welcome/welcome'
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
