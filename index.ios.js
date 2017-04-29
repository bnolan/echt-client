import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Camera from './components/Camera';
import Newsfeed from './components/Newsfeed';
import Friends from './components/Friends';
// import Welcome from './components/Welcome';
import Settings from './components/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

const TabNavigatorMain = TabNavigator({
  Camera: {
    screen: Camera,
    path: '',
    navigationOptions: {
      // Workaround: https://github.com/react-community/react-navigation/pull/152#issuecomment-289256939
      // Should be replaced by https://github.com/react-community/react-navigation/pull/984 on next release of the lib
      tabBar: (navigation, defaultOptions) => ({
        ...defaultOptions,
        title: 'Camera',
        visible: false,
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-camera' : 'ios-camera-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      })
    }
  },
  Newsfeed: {
    screen: Newsfeed,
    path: 'newsfeed',
    navigationOptions: {
      tabBar: (navigation, defaultOptions) => ({
        title: 'Photos',
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-photos' : 'ios-photos-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      })
    }
  },
  Friends: {
    screen: Friends,
    path: 'friends',
    navigationOptions: {
      tabBar: (navigation, defaultOptions) => ({
        title: 'Friends',
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-people' : 'ios-people-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      })
    }
  },
  Settings: {
    screen: Settings,
    path: 'settings',
    navigationOptions: {
      tabBar: (navigation, defaultOptions) => ({
        title: 'Settings',
        icon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      })
    }
  }
}, {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#ff00aa',
    activeBackgroundColor: '#ffffff',
    inactiveBackgroundColor: '#ffffff',
    inactiveTintColor: '#333333'
  },
  swipeEnabled: true,
  animationEnabled: true
});

const AppNavigator = StackNavigator({
  Main: {
    screen: TabNavigatorMain,
    path: 'main'
  }
}, {
  initialRouteName: 'Main',
  headerMode: 'none',
  mode: 'modal'
});

AppRegistry.registerComponent('Echt', () => AppNavigator);
