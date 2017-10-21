import { StackNavigator } from 'react-navigation';
import CameraScreen from '../screens/Camera';
import InstructionsScreen from '../screens/welcome/Instructions';

export default StackNavigator({
  Camera: {
    screen: CameraScreen
  },
  Instructions: {
    screen: InstructionsScreen,
    path: 'instructions',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
