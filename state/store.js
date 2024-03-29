/* global fetch, __DEV__ */

import { AsyncStorage } from 'react-native';
import { observable, computed } from 'mobx';
import { STATUS, PHOTO_STATUS } from '../constants';
import config from '../config';
import assert from 'assert';
import RNFS from 'react-native-fs';
import uuid from 'uuid/v4';
import resize from '../helpers/resize';
import fixtures from './fixtures';

export class EchtStore {
  // Uploads currently in progress (with auto-generated uuids)
  @observable uploads = [];

  @observable photos = [];

  @observable friends = [];

  @observable user = {
    key: null,
    loggedIn: false,
    seenWelcome: false // used to skip intro
  };

  @observable loaded = false;

  constructor () {
    this.isFixture = false;
  }

  get fetch () {
    function mockFetch () {
      console.log('Mocking fetch...');
      return { then: mockFetch, catch: mockFetch };
    }

    if (this.isFixture) {
      return mockFetch;
    } else {
      return fetch;
    }
  }

  loadFixture (fixture) {
    // Prevents any network requests
    this.isFixture = true;

    this.uploads.replace(
      (fixture.uploads || []).map((u) => observable.map(u))
    );

    this.photos.replace(
      (fixture.photos || []).map((p) => observable.map(p))
    );

    this.friends.replace(
      (fixture.friends || []).map((f) => observable.map(f))
    );

    this.user.key = fixture.user.key;
    this.user.loggedIn = fixture.user.loggedIn;
    this.user.seenWelcome = fixture.user.seenWelcome;

    this.loaded = true;

    // Don't call save() here since we want fixtures to only persist
    // for the current "session"

    // Wait until we have the navigation singleton
    const interval = setInterval(() => {
      if (this.navigation) {
        clearTimeout(interval);
      } else {
        return;
      }

      this.navigation.dispatch({
        type: 'Navigation/NAVIGATE',
        routeName: fixture.route.name,
        params: fixture.route.params
      });
    }, 50);
  }

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

  get isDevMode () {
    return !!__DEV__;
  }

  get endpoint () {
    return __DEV__ ? config.endpoint.uat : config.endpoint.prod;
  }

  // Headers for loggedIn users
  @computed get headers () {
    return {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'x-devicekey': this.deviceKey
    };
  }

  @computed get deviceKey () {
    return this.user.key;
  }

  @computed get loggedIn () {
    return (!!this.user.key) && (this.user.loggedIn);
  }

  getPhoto (uuid) {
    return this.photos.find(p => p.get('uuid') === uuid);
  }

  getUpload (uuid) {
    return this.uploads.find(p => p.get('uuid') === uuid);
  }

  getFriend (uuid) {
    return this.friends.find(p => p.get('uuid') === uuid);
  }

  acceptFriendRequest (uuid) {
    let response;
    const request = { uuid: uuid, status: STATUS.ACCEPTED };

    this.remove(this.friends, [{ uuid: uuid }]);

    return this.fetch(`${this.endpoint}/friends`, {
      method: 'put',
      headers: this.headers,
      body: JSON.stringify(request)
    })
    .then((r) => r.json())
    .then((r) => {
      // fixme don't do this ganky shit with response
      response = r;
      return this.refreshFriends();
    }).then(() => {
      return response;
    });
  }

  sendFriendRequest (friendId, photoId) {
    let response;
    const request = { user: friendId, photoId: photoId };

    return this.fetch(`${this.endpoint}/friends`, {
      method: 'post',
      headers: this.headers,
      body: JSON.stringify(request)
    })
    .then((r) => r.json())
    .then((r) => {
      // fixme don't do this ganky shit with response
      response = r;
      return this.refreshFriends();
    }).then(() => {
      return response;
    });
  }

  signup (path) {
    return this.fetch(`${this.endpoint}/sign-up`)
      .then((r) => r.json())
      .then((body) => {
        this.user.key = body.deviceKey;
      })
      .then(() => {
        // Resize to a smaller version for faster initial signup.
        // Face reco only needs ~100px per face.
        return resize.toMedium(path);
      })
      .then(resizeResult => {
        return RNFS.readFile(resizeResult.path, 'base64');
      })
      .then((b64) => {
        const request = {
          image: b64
        };

        return this.fetch(`${this.endpoint}/sign-up`, {
          method: 'post',
          headers: this.headers,
          body: JSON.stringify(request)
        });
      })
      .then((r) => r.json())
      .then((body) => {
        if (body.success) {
          const uuid = body.user.photo.uuid;
          this.user.key = body.deviceKey;
          this.save();

          this.backgroundUpload(uuid, path);
        }

        return body;
      });
  }

  generateUpload () {
    const upload = observable.map({
      uuid: uuid()
    });

    this.merge(this.uploads, [upload]);

    // Return uploading photo
    return upload;
  }

  deleteUser () {
    if (!this.loggedIn) {
      return false;
    }

    return this.fetch(`${this.endpoint}/sign-up`, {
      method: 'delete',
      headers: this.headers
    }).then(() => {
      return this.clear();
    });
  }

  /**
   * @param {Object} Camera data, incl. the 'path' to a temporary file
   * @param {Object} A placeholder object with a temporary uuid.
   * @param {Object} Metadata about the taken photo
   */
  takePhoto (data, upload, details) {
    if (!this.loggedIn) {
      return false;
    }

    console.log('#takePhoto', data, upload, details);

    // UUID is generated client side and is accepted and persisted by the server
    // (unless the UUID already exists)
    var photo = {
      uuid: upload.get('uuid'),
      info: {
        camera: details.camera
      },
      status: PHOTO_STATUS.UPLOADING,
      original: { url: data.path },
      small: { url: data.path },
      createdAt: new Date().toISOString()
    };

    // Set thumbnail
    upload.set('url', data.path);

    // Add to newsfeed
    this.merge(this.photos, [photo]);
    this.merge(this.uploads, [upload]);

    // Upload a smaller version first for faster face reco.s
    return resize.toMedium(data.path)
      .then(resizeResult => {
        return RNFS.readFile(resizeResult.path, 'base64');
      })
      .then((data) => {
        const request = {
          image: data,
          camera: details.camera,
          uuid: photo.uuid
        };

        console.log('#uploading...');

        return this.fetch(`${this.endpoint}/photos`, {
          method: 'post',
          headers: this.headers,
          body: JSON.stringify(request)
        });
      }).then(
        (response) => response.json()
      ).then((r) => {
        console.log('Upload complete', r);
        assert(r.success);

        // Upload the photo
        Object.assign(photo, r.photo);

        if (r.photo.actions.length > 0) {
          // Photos with actions stay on the homescreen
          upload.set('actions', r.photo.actions);
          console.log('Upload has actions');
        } else {
          // Otherwise they get deleted
          this.remove(this.uploads, [upload]);
          console.log('Upload has no actions');
        }

        // Save the collection with the new photo
        this.save();

        // Upload the full picture in the background
        this.backgroundUpload(photo.uuid, data.path);

        return r;
      })
      .catch((e) => {
        console.error('Error uploading...');
        console.error(e);
      });
  }

  backgroundUpload (uuid, path) {
    RNFS.readFile(path, 'base64').then(data => {
      console.log('Background upload for ', path);
      const request = {
        image: data,
        uuid: uuid
      };
      return fetch(`${this.endpoint}/photos`, {
        method: 'put',
        headers: this.headers,
        body: JSON.stringify(request)
      });
    }).then(
      (response) => response.json()
    ).then((r) => {
      console.log('Background upload complete', r);
      assert(r.success);
    });
  }

  deletePhoto (photoId) {
    if (!this.loggedIn) {
      return false;
    }

    assert(photoId);

    return this.fetch(`${this.endpoint}/photos`, {
      method: 'DELETE',
      body: JSON.stringify({uuid: photoId}),
      headers: this.headers
    }).then(r => {
      this.photos = this.photos.filter(photo => photo.get('uuid') !== photoId);
      this.save();
    });
  }

  refreshPhotos () {
    if (!this.loggedIn) {
      return false;
    }

    // todo - send ?since=timestamp
    return this.fetch(`${this.endpoint}/photos`, {
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

    return this.fetch(`${this.endpoint}/friends`, {
      headers: this.headers
    }).then(
      (response) => response.json()
    ).then((r) => {
      this.friends = this.merge(this.friends, r.friends);
      this.save();
    });
  }

  /**
   * @param {Array<mobx.map>} Items to be modified
   * @param {Array<object>} Items to be removed by uuid
   * @return {Array<object>} Items removed
   */
  remove (storedItems = [], removedItems = []) {
    var result = [];

    removedItems.forEach((i) => {
      var index = storedItems.findIndex((p) => p.get('uuid') === i.uuid);

      if (index > -1) {
        storedItems.splice(index, 1);
        result.push(i);
      }
    });

    return result;
  }

  /**
   * @param {Array<mobx.map>} Items already in store
   * @param {Array<object|mobx.map>} Items to be merged in (can contain duplicates)
   * @return {Array<mobx.map>} Merged items
   */
  merge (storedItems = [], receivedItems = []) {
    // We assume that the storedItems is an array of mobx observable.maps,
    // not an array of objects.
    receivedItems.forEach((i) => {
      var existing;

      if (i.uuid) {
        existing = storedItems.find((p) => p.get('uuid') === i.uuid);
      } else if (i.get && i.get('uuid')) {
        existing = storedItems.find((p) => p.get('uuid') === i.get('uuid'));
      } else {
        existing = false;
      }

      if (existing) {
        // We merge into the observable.map
        existing.merge(i);
      } else {
        // Add to front of the array
        storedItems.unshift(i.get ? i : observable.map(i));
      }
    });

    return storedItems;
  }

  load () {
    const getUser = AsyncStorage.getItem('user').then((user) => {
      if (user) {
        this.user = JSON.parse(user);
      }
    });

    const getPhotos = AsyncStorage.getItem('photos').then((result) => {
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

    const getFriends = AsyncStorage.getItem('friends').then((result) => {
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

    return Promise.all([
      getUser,
      getPhotos,
      getFriends
    ]).then(() => {
      this.loaded = true;
    });
  }

  save () {
    AsyncStorage.setItem('user', JSON.stringify(this.user));

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

if (config.fixture) {
  assert(fixtures[config.fixture], 'Invalid fixture in config.js');
  echtStore.loadFixture(fixtures[config.fixture]);
} else {
  echtStore.load();
}

// DEBUGGING ONLY - see https://corbt.com/posts/2015/12/19/debugging-with-global-variables-in-react-native.html
//   (or you can use in production if you want, i'm not your mum. but ingo might smother you)
global.__store = echtStore;

export default echtStore;
