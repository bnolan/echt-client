import React from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Camera from '../screens/Camera';
import Settings from '../screens/Settings';
import NewsfeedNavigator from './NewsfeedNavigator';
import FriendsNavigator from './FriendsNavigator';

export default TabNavigator({
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
    screen: NewsfeedNavigator,
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
    screen: FriendsNavigator,
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
    activeTintColor: '#007AFF',
    activeBackgroundColor: '#ffffff',
    inactiveBackgroundColor: '#ffffff',
    inactiveTintColor: '#333333'
  },
  swipeEnabled: true,
  animationEnabled: true
});
