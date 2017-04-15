import React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Camera from './components/camera';
import Newsfeed from './components/newsfeed';
import Friends from './components/friends';
import Welcome from './components/welcome';
import Settings from './components/settings';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

export default class Echt extends React.Component {
  get loggedIn () {
    return true;
  }

  render () {
    /*

      We have to have removeClippedSubviews={true} or the camera component
      just renders as black

      https://github.com/lwansbrough/react-native-camera/issues/585

    */

    if (!this.loggedIn) {
      return <Welcome />;
    }

    return (
      <Swiper
        ref={(swiper) => { this.swiper = swiper; }}
        style={styles.wrapper}
        showsPagination={false}
        removeClippedSubviews={true}
        loop={false}>
        <View style={styles.slide1}>
          <Camera />
        </View>
        <View style={styles.slide2}>
          <Newsfeed />
        </View>
        <View style={styles.slide3}>
          <Friends />
        </View>
        <View style={styles.slide4}>
          <Settings />
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  shutter: {
    borderWidth: 4,
    borderColor: 'white',
    width: 64,
    height: 64,
    borderRadius: 64,
    marginTop: 500
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  slide1: {
    flex: 1,
    backgroundColor: '#ff00aa'
  },
  slide2: {
    flex: 1,
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  date: {
    width: 120,
    height: 120,
    padding: 20,
    backgroundColor: '#777'
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column'
  }
});

AppRegistry.registerComponent('Echt', () => Echt);
