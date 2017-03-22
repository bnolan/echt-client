/* globals fetch */

import React from 'react';
import { TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';
// Lightbox is ganky and out of date but shows the idea
import Lightbox from 'react-native-lightbox';
import Friends from './components/friends';
import Swiper from 'react-native-swiper';

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIwNGM0YjE1ZS1hYmQzLTQ4N2EtYjQxZi03MWM0MzQwYWEwODEiLCJkZXZpY2VJZCI6IjdlNGExODY5LTEyNzItNDk2ZS1iMmYyLTE3MWNiZWRlNjBkMSIsImlhdCI6MTQ5MDEwNjUyMX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

const benKey = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0.';
const ingoKey = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzNTBiYjkxMi0xMWM0LTQxNGQtOGJkNy00NDZmYmQ4MGQ0NzUiLCJkZXZpY2VJZCI6ImNhOWRiYTY1LWU2YjItNDk4Zi05YzhhLTczOTJiZDc4ZTI5MiIsImlhdCI6MTQ5MDEwOTE0NH0.';

const endpoint = 'https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat';

export default class App extends React.Component {
  constructor () {
    super();

    this.state = {
      photos: []
    };
  }

  componentDidMount () {
    fetch(`${endpoint}/photos`, {
      headers: {
        'x-devicekey': benKey
      }
    }).then(
      (response) => response.json()
    ).then((r) => {
      console.log(r);

      this.setState({
        photos: r.items.reverse()
      });
    });
  }

  render () {
    const photos = this.state.photos.map((photo) => {
      return (
        <Lightbox
          key={photo.uuid}
          activeProps={{
            width: 400,
            height: 400,
            source: {uri: photo.original.url}
          }}>
          <Image
            style={{width: 120, height: 120}}
            source={{uri: photo.small.url}}
          />
        </Lightbox>
      );
    });

    return (
      <Swiper style={styles.wrapper} showsPagination={false}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Take photo</Text>
          <TouchableHighlight>
            <View style={styles.shutter}></View>
          </TouchableHighlight>
        </View>
        <View style={styles.slide2}>
          <View style={styles.container}>
            <View style={styles.date}>
              <Text style={styles.dateText}>03.03</Text>
            </View>
            {photos}
          </View>
        </View>
        <View style={styles.slide3}>
          <Friends />
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
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
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
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  date: {
    width: 124,
    height: 124,
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
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
