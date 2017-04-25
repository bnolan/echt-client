import { AsyncStorage } from 'react-native';
import { observable } from 'mobx';
import { PHOTO_STATUS } from '../constants';
import config from '../config';
import assert from 'assert';
import RNFS from 'react-native-fs';
import uuid from 'uuid';

class EchtStore {
  @observable photos = [];

  @observable friends = [];

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
      this.photos = this.merge(this.photos, r.items);
      this.save();
    });
  }

  refreshFriends () {
    assert(this.loggedIn);

    fetch(`${config.endpoint.uat}/friends`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'x-devicekey': this.deviceKey
      }
    }).then(
      (response) => response.json()
    ).then((r) => {
      this.friends = this.merge(this.friends, r.friends);
      this.save();
    });
  }

  /**
   * @param {Array} Items already in store
   * @param {Array} Items to be merged in (can contain duplicates)
   * @return {Array} Merged items
   */
  merge (storedItems = [], receivedItems = []) {
    var added = 0;
    var merged = 0;

    receivedItems.forEach((i) => {
      var existing;

      if (i.uuid) {
        existing = storedItems.find((p) => p.uuid === i.uuid);
      } else {
        existing = false;
      }

      if (existing) {
        // We merge because they might be updated
        Object.assign(existing, i);
        merged++;
      } else {
        // Add to front of the photos
        storedItems.unshift(i);
        added++;
      }
    });

    console.log(`Added ${added} and merged ${merged} items into collection`);
    console.log(`Collection has ${storedItems.length} items in it`);

    return storedItems;
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
        this.photos = this.merge(this.photos, items);
      }

      this.refreshPhotos();
    });

    AsyncStorage.getItem('friends').then((result) => {
      var items;

      try {
        items = JSON.parse(result).reverse();
      } catch (e) {
        items = [];
      }

      if (items) {
        this.friends = this.merge(this.friends, items);
      }

      this.refreshFriends();
    });
  }

  save () {
    AsyncStorage.setItem('deviceKey', this.user.key);

    const photos = this.photos.filter((p) => p.status !== PHOTO_STATUS.UPLOADING);
    AsyncStorage.setItem('photos', JSON.stringify(photos));

    const friends = this.friends;
    AsyncStorage.setItem('friends', JSON.stringify(friends));
  }
}

const echtStore = new EchtStore()
echtStore.load();

export default echtStore
