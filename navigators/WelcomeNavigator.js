import { StackNavigator } from 'react-navigation';
import WelcomeScreen from '../screens/welcome/Welcome';
import SelfieScreen from '../screens/welcome/Selfie';
// import PincodeScreen from '../screens/welcome/Pincode';
import InstructionsScreen from '../screens/welcome/Instructions';

export default StackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    path: 'welcome/welcome'
  },
  Selfie: {
    screen: SelfieScreen,
    path: 'welcome/selfie'
  },
  // TODO Use PIN screen once it can be made optional
  // Pincode: {
  //   screen: PincodeScreen,
  //   path: 'welcome/pincode'
  // },
  Instructions: {
    screen: InstructionsScreen,
    path: 'welcome/instructions'
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});