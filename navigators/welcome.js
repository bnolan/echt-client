import { StackNavigator } from 'react-navigation';
import Welcome from '../screens/welcome/welcome';
import Selfie from '../screens/welcome/selfie';
// import Pincode from '../screens/welcome/pincode';
import Instructions from '../screens/welcome/instructions';

// 🍆💦💦🍑
const WelcomeNavigator = StackNavigator({
  Welcome: {
    screen: Welcome,
    path: 'welcome/welcome'
  },
  Selfie: {
    screen: Selfie,
    path: 'welcome/selfie'
  },
  // TODO Use PIN screen once it can be made optional
  // Pincode: {
  //   screen: Pincode,
  //   path: 'welcome/pincode'
  // },
  Instructions: {
    screen: Instructions,
    path: 'welcome/instructions'
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default WelcomeNavigator;
