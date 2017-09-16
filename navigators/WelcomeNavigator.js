import { StackNavigator } from 'react-navigation';
import WelcomeScreen from '../screens/welcome/Welcome';
import CameraScreen from '../screens/Camera';
// import PincodeScreen from '../screens/welcome/Pincode';
import InstructionsScreen from '../screens/welcome/Instructions';

export default StackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    path: 'welcome/welcome'
  },
  Selfie: {
    screen: CameraScreen,
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
