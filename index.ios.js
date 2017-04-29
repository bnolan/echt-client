import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Camera from './components/Camera';
import Newsfeed from './components/Newsfeed';
import Friends from './components/Friends';
import Photo from './components/Photo';
import Friend from './components/Friend';
// import Welcome from './components/Welcome';
import Settings from './components/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

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
  // TODO Enable once you can close a stack detail view properly
  swipeEnabled: false,
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
