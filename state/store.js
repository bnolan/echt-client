/* global fetch */

import { AsyncStorage } from 'react-native';
import { observable } from 'mobx';
import { PHOTO_STATUS } from '../constants';
import config from '../config';
import assert from 'assert';
import RNFS from 'react-native-fs';
import uuid from 'uuid/v4';

class EchtStore {
  @observable uploads = [];

  @observable photos = [];

  @observable friends = [];

  @observable user = {
    key: null
  };

  /**
   * CAUTION: Use for debugging purposes only
   */
  setDeviceKey (key) {
    this.user.key = key;
    this.photos = [];
    this.friends = [];
    this.save();
    this.refreshFriends();
    this.refreshPhotos();
  }

  get endpoint () {
    return config.endpoint.uat;
  }

  // Headers for loggedIn users
  get headers () {
    return {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'x-devicekey': this.deviceKey
    };
  }

  get deviceKey () {
    return this.user.key;
  }

  get loggedIn () {
    return !!this.user.key;
  }

  getPhoto (uuid) {
    return this.photos.find(p => p.uuid === uuid);
  }

  getFriend (uuid) {
    return this.friends.find(p => p.uuid === uuid);
  }

  signup (path) {
    return fetch(`${this.endpoint}/sign-up`)
      .then((r) => r.json())
      .then((body) => {
        this.user.key = body.deviceKey;
      })
      .then(() => {
        return RNFS.readFile(path, 'base64');
      })
      .then((b64) => {
        const request = {
          image: b64
        };

        return fetch(`${this.endpoint}/sign-up`, {
          method: 'post',
          headers: this.headers,
          body: JSON.stringify(request)
        });
      })
      .then((r) => r.json())
      .then((body) => {
        this.user.key = body.deviceKey;

        return body;
      });
  }

  takePhoto (data, details) {
    if (!this.loggedIn) {
      return false;
    }

    // UUID is generated client side and is accepted and persisted by the server
    // (unless the UUID already exists)
    var photo = {
      uuid: uuid(),
      info: {
        camera: details.camera
      },
      status: PHOTO_STATUS.UPLOADING,
      original: { url: data.path },
      small: { url: data.path },
      createdAt: new Date().toISOString()
    };

    var upload = {
      uuid: photo.uuid,
      url: data.path
    };

    // Add to newsfeed
    this.merge(this.photos, [photo]);

    // Display uploading photo
    this.merge(this.uploads, [upload]);

    return RNFS.readFile(data.path, 'base64')
      .then((data) => {
        const request = {
          image: data,
          camera: details.camera
        };

        return fetch(`${this.endpoint}/photos`, {
          method: 'post',
          headers: this.headers,
          body: JSON.stringify(request)
        });
      }).then(
        (response) => response.json()
      ).then((r) => {
        assert(r.success);

        // Upload the photo
        Object.assign(photo, r.photo);

        if (r.photo.actions.length > 0) {
          // Photos with actions stay on the homescreen
          upload.actions = r.photo.actions;
        } else {
          // Otherwise they get deleted
          this.remove(this.uploads, [upload]);
        }

        // Save the collection with the new photo
        this.save();
      });
  }

  deletePhoto (photoId) {
    if (!this.loggedIn) {
      return false;
    }

    assert(photoId);

    return fetch(`${this.endpoint}/photos`, {
      method: 'DELETE',
      body: JSON.stringify({uuid: photoId}),
      headers: this.headers
    }).then(r => {
      this.photos = this.photos.filter(photo => photo.uuid !== photoId);
      this.save();
    });
  }

  refreshPhotos () {
    if (!this.loggedIn) {
      return false;
    }

    // todo - send ?since=timestamp
    return fetch(`${this.endpoint}/photos`, {
      headers: this.headers
    }).then(
      (response) => response.json()
    ).then((r) => {
      this.photos = this.merge(this.photos, r.items);
      this.save();
    });
  }

  refreshFriends () {
    if (!this.loggedIn) {
      return false;
    }

    return fetch(`${this.endpoint}/friends`, {
      headers: this.headers
    }).then(
      (response) => response.json()
    ).then((r) => {
      this.friends = this.merge(this.friends, r.friends);
      this.save();
    });
  }

  /**
   * @param {Array} Items to be modified
   * @param {Array} Items to be removed by uuid
   * @return {Array} Items removed
   */
  remove (storedItems = [], removedItems = []) {
    var result = [];

    console.log(storedItems, removedItems);

    removedItems.forEach((i) => {
      var index = storedItems.findIndex((p) => p.uuid === i.uuid);

      console.log(index);

      if (index > -1) {
        storedItems.splice(index, 1);
        result.push(i);
      }
    });

    return result;
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

  clear () {
    // Clear everything
    this.uploads.clear();
    this.photos.clear();
    this.friends.clear();

    // Start over
    this.user = {
      key: null
    };

    return AsyncStorage.clear();
  }
}

const echtStore = new EchtStore();
echtStore.load();

// DEBUGGING ONLY - see https://corbt.com/posts/2015/12/19/debugging-with-global-variables-in-react-native.html
global.__store = echtStore;

export default echtStore;
