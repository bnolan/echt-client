import React from 'react';
import { AppRegistry } from 'react-native';
import { observer } from 'mobx-react/native';

import Loading from './screens/Loading';
import MainNavigator from './navigators/MainNavigator';
import WelcomeNavigator from './navigators/WelcomeNavigator';
import store from './state/store';

@observer
class App extends React.Component {
  // TODO Doesn't pass through
  // getChildContext () {
  //   return {
  //     isSimulator: .isSimulator
  //   };
  // }
  render () {
    if (!store.loaded) {
      return <Loading />;
    }

    if (store.loggedIn) {
      // https://github.com/react-community/react-navigation/issues/876
      return <MainNavigator screenProps={{isSimulator: this.props.isSimulator}} />;
    } else {
      // https://github.com/react-community/react-navigation/issues/876
      return <WelcomeNavigator screenProps={{isSimulator: this.props.isSimulator}} />;
    }
  }
}
// App.childContextTypes = {
//   isSimulator: PropTypes.boolean
// };

AppRegistry.registerComponent('Echt', () => App);
