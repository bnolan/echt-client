import { AsyncStorage } from 'react-native';
import { observable } from 'mobx';
import { PHOTO_STATUS } from '../constants';
import config from '../config';
import assert from 'assert';
import RNFS from 'react-native-fs';
import uuid from 'uuid';

class EchtStore {
  @observable photos = [];

  @observable user = {
    key: null
  };

  get deviceKey () {
    return this.user.key;
  }

  get loggedIn () {
    return !!this.user.key;
  }

  takePhoto (data, details) {
    assert(this.loggedIn);

    // UUID is temporary and is rewritten when the photo has been uploaded, might
    // be nice to have a persistent client uuid so that we could persist UPLOADING
    // photos to the AsyncStorage.
    var temporaryPhoto = {
      uuid: uuid(),
      info: {
        camera: details.camera
      },
      status: PHOTO_STATUS.UPLOADING,
      original: { url: `file://${data.path}` },
      small: { url: `file://${data.path}` },
      createdAt: new Date().toISOString()
    }

    this.mergePhotos([temporaryPhoto]);

    return RNFS.readFile(data.path, 'base64')
      .then((data) => {
        const request = {
          image: data,
          camera: details.camera
        };

        return fetch(`${config.endpoint.uat}/photos`, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-devicekey': this.deviceKey
          },
          body: JSON.stringify(request)
        });
      }).then(
        (response) => response.json()
      ).then((r) => {
        assert(r.success);

        // Upload the photo
        Object.assign(temporaryPhoto, r.photo);

        // Save the collection with the new photo
        this.save();
      })
  }

  refreshPhotos () {
    assert(this.loggedIn);

    // todo - send ?since=timestamp
    fetch(`${config.endpoint.uat}/photos`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'x-devicekey': this.deviceKey
      }
    }).then(
      (response) => response.json()
    ).then((r) => {
      this.mergePhotos(r.items);
      this.save();
    });
  }

  mergePhotos (items) {
    var added = 0;
    var merged = 0;

    items.forEach((i) => {
      var existing;

      if (i.uuid) {
        existing = this.photos.find((p) => p.uuid === i.uuid);
      } else {
        existing = false;
      }

      if (existing) {
        // We merge because they might be updated
        Object.assign(existing, i);
        merged++;
      } else {
        // Add to front of the photos
        this.photos.unshift(i);
        added++;
      }
    });

    console.log(`Added ${added} and merged ${merged} photos into collection`);
    console.log(`Photos collection has ${this.photos.length} items in it`);
  }

  load () { 
    AsyncStorage.getItem('deviceKey').then((key) => {
      this.user.key = key;
    });

    AsyncStorage.getItem('photos').then((result) => {
      var items;

      try {
        items = JSON.parse(result).reverse();
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

    const photos = this.photos.filter((p) => p.status !== PHOTO_STATUS.UPLOADING);
    AsyncStorage.setItem('photos', JSON.stringify(photos));
  }
}

const echtStore = new EchtStore()
echtStore.load();

export default echtStore
