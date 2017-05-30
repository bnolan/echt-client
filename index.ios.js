import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Loading from './screens/Loading';
import MainNavigator from './navigators/MainNavigator';
import WelcomeNavigator from './navigators/WelcomeNavigator';

const AppNavigator = StackNavigator({
  Loading: {
    screen: Loading
  },
  Main: {
    screen: MainNavigator,
    path: 'main'
  },
  Welcome: {
    screen: WelcomeNavigator,
    path: 'welcome/welcome'
  }
}, {
  // The loading screen checks if we are signed in and then redirects, I'd
  // rather do it all here but can't work out how to do it
  initialRouteName: 'Loading',
  headerMode: 'none',
  mode: 'modal'
});

class App extends React.Component {
  // TODO Doesn't pass through
  // getChildContext () {
  //   return {
  //     isSimulator: .isSimulator
  //   };
  // }
  render () {
    // https://github.com/react-community/react-navigation/issues/876
    return <AppNavigator screenProps={{isSimulator: this.props.isSimulator}} />;
  }
}
// App.childContextTypes = {
//   isSimulator: PropTypes.boolean
// };

AppRegistry.registerComponent('Echt', () => App);
