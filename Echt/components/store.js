import { AsyncStorage } from 'react-native';
import { observable } from 'mobx';
import config from '../config';

class EchtStore {
  @observable photos = [];

  @observable user = {
    key: null
  };

  refreshPhotos () {
    // todo - send ?since=timestamp
    fetch(`${config.endpoint.uat}/photos`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'x-devicekey': this.user.key
      }
    }).then(
      (response) => response.json()
    ).then((r) => {
      console.log(r);
      this.mergePhotos(r.items);
      this.save();
    });
  }

  mergePhotos (items) {
    var merged = 0;

    items.forEach((i) => {
      const existing = this.photos.find((p) => p.uuid === i.uuid);

      if (!existing) {
        this.photos.push(i);
        merged++;
      }
    });

    console.log(`Merged ${merged} photos into collection`);
    console.log(`Photos collection has ${this.photos.length} items in it`);
  }

  load () { 
    AsyncStorage.getItem('deviceKey').then((key) => {
      this.user.key = key;
    });

    AsyncStorage.getItem('photos').then((result) => {
      var items;

      try {
        items = JSON.parse(result);
      } catch (e) {
        items = [];
      }

      if (items) {
        this.mergePhotos(items);
      }

      this.refreshPhotos();
    });
  }

  save () {
    AsyncStorage.setItem('deviceKey', this.user.key);
    AsyncStorage.setItem('photos', JSON.stringify(this.photos));
  }
}

const echtStore = new EchtStore()
echtStore.load();

export default echtStore
