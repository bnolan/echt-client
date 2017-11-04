import React from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CameraNavigator from './CameraNavigator';
import Settings from '../screens/Settings';
import NewsfeedNavigator from './NewsfeedNavigator';
import FriendsNavigator from './FriendsNavigator';

export default TabNavigator({
  CameraNav: {
    screen: CameraNavigator,
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
    screen: NewsfeedNavigator,
    path: 'newsfeed',
    navigationOptions: ({ navigation, screenProps }) => {
      // Hide photo route in photo detail view
      const routes = navigation.state.routes;
      const isPhotoRoute = (routes[routes.length - 1].routeName === 'NewsfeedPhoto');
      return {
        tabBarLabel: 'Photos',
        tabBarVisible: !(isPhotoRoute),
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
    screen: FriendsNavigator,
    path: 'friends',
    navigationOptions: ({ navigation, screenProps }) => {
      // Hide photo route in photo detail view
      const routes = navigation.state.routes;
      const isPhotoRoute = (routes[routes.length - 1].routeName === 'FriendsPhoto');

      return {
        tabBarLabel: 'Friends',
        tabBarVisible: !(isPhotoRoute),
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
    activeTintColor: '#007AFF',
    activeBackgroundColor: '#ffffff',
    inactiveBackgroundColor: '#ffffff',
    inactiveTintColor: '#333333'
  },
  // TODO Interferes with PhotoBrowser
  // see https://github.com/react-community/react-navigation/issues/1760#issuecomment-336521248
  swipeEnabled: false,
  animationEnabled: true
});
