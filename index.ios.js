import codePush from 'react-native-code-push';
import Loading from './screens/Loading';
import MainNavigator from './navigators/MainNavigator';
import React from 'react';
import store from './state/store';
import WelcomeNavigator from './navigators/WelcomeNavigator';
import { AppRegistry } from 'react-native';
import { observer } from 'mobx-react/native';

@observer class App extends React.Component {
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

// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// App = codePush(codePushOptions)(App);

@codePush class EchtApp extends React.Component {
  render () {
    return <App />;
  }
}

// App.childContextTypes = {
//   isSimulator: PropTypes.boolean
// };

AppRegistry.registerComponent('Echt', () => EchtApp);
