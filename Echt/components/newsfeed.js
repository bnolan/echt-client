import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Image, View } from 'react-native';
import { observer } from 'mobx-react/native';

// Lightbox is ganky and out of date but shows the idea
import Lightbox from 'react-native-lightbox';

// import RNFS from 'react-native-fs';
import store from '../state/store';

const { width } = Dimensions.get('window');
const itemDimension = width / 3;

// curl --header "x-devicekey: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0." https://xypqnmu05f.execute-api.us-west-2.amazonaws.com/uat/photos

@observer
class PhotoList extends React.Component {
  reload () {
  }

  render () {
    // Todo - render loading image:
    //  source={{uri: photo.inline ? photo.inline.url : photo.small.url}}

    const photos = this.props.photos.map((photo) => {
      return (
        <View style={styles.item} key={photo.uuid}>
          <Lightbox
            activeProps={{
              width: 400,
              height: 400,
              source: {uri: photo.original.url}
            }}>
            <Image
              style={{width: itemDimension, height: itemDimension}}
              source={{uri: photo.small.url}}
            />
          </Lightbox>
        </View>
      );
    });

    return (
      <View style={styles.wrapper}>
        {photos}
      </View>
    );
  }
}

@observer
export default class Newsfeed extends React.Component {
  render () {
    return (
      <ScrollView style={styles.container}>
        <PhotoList photos={store.photos} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  header: {
    backgroundColor: '#ff00aa'
  },
  item: {
    width: itemDimension,
    height: itemDimension,
    flex: 0
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
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
