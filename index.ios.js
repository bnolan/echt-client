import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Camera from './components/Camera';
import Newsfeed from './components/Newsfeed';
import Friends from './components/Friends';
import Photo from './components/Photo';
import Friend from './components/Friend';
import WelcomeNavigator from './navigators/welcome';
import Settings from './components/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from './state/store';

const StackNavigatorNewsfeed = StackNavigator({
  Main: {
    screen: Newsfeed
  },
  Photo: {
    screen: Photo,
    path: 'photo/:uuid',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});

const StackNavigatorFriends = StackNavigator({
  Main: {
    screen: Friends
  },
  Friend: {
    screen: Friend,
    path: 'friend/:uuid',
    navigationOptions: {
      headerMode: 'screen'
    }
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});

const TabNavigatorMain = TabNavigator({
  Camera: {
    screen: Camera,
    path: '',
    navigationOptions: {
      tabBarLabel: 'Camera',
      tabBarVisible: false,
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-camera' : 'ios-camera-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Newsfeed: {
    screen: StackNavigatorNewsfeed,
    path: 'newsfeed',
    navigationOptions: ({ navigation, screenProps }) => {
      // Hide photo route in photo detail view
      const photoRoute = navigation.state.routes
        .find(r => r.routeName === 'Photo');

      return {
        tabBarLabel: 'Photos',
        tabBarVisible: !(photoRoute),
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-photos' : 'ios-photos-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      };
    }
  },
  Friends: {
    screen: StackNavigatorFriends,
    path: 'friends',
    navigationOptions: ({ navigation, screenProps }) => {
      // Hide photo route in photo detail view
      const photoRoute = navigation.state.routes
        .find(r => r.routeName === 'Photo');

      return {
        tabBarLabel: 'Friends',
        tabBarVisible: !(photoRoute),
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-people' : 'ios-people-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      };
    }
  },
  Settings: {
    screen: Settings,
    path: 'settings',
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      )
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
  },
  Welcome: {
    screen: WelcomeNavigator,
    path: 'welcome/welcome'
  }
}, {
  initialRouteName: false ? 'Main' : 'Welcome',
  headerMode: 'none',
  mode: 'modal'
});

AppRegistry.registerComponent('Echt', () => AppNavigator);
