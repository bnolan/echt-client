/* global fetch, __DEV__ */

import { AsyncStorage } from 'react-native';
import { observable, computed } from 'mobx';
import { STATUS, PHOTO_STATUS } from '../constants';
import config from '../config';
import assert from 'assert';
import mobx from 'mobx';
import RNFS from 'react-native-fs';
import uuid from 'uuid/v4';

import fixture from './fixtures/add-friend';

export class EchtStore {
  @observable uploads = [];

  @observable photos = [];

  @observable friends = [];

  @observable user = {
    key: null,
    loggedIn: false // used to mark finalisation of welcome screens
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

    this.loaded = true;

    console.log(fixture.uploads);
    console.log(mobx.toJS(this.uploads));

    // Wait until we have the navigation singleton
    const interval = setInterval(() => {
      if (this.navigation) {
        clearTimeout(interval);
      } else {
        return;
      }

      this.navigation.dispatch({
        type: 'Navigate',
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
        return RNFS.readFile(path, 'base64');
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
          this.user.key = body.deviceKey;
          this.save();
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

    return RNFS.readFile(data.path, 'base64')
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
      })
      .catch((e) => {
        console.error('Error uploading...');
        console.error(e);
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
      this.photos = this.photos.filter(photo => photo.uuid !== photoId);
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
      // FIXME DONT COMMIT
      // r = {
      //   "friends": [
      //     {
      //       "createdAt": "2017-06-11T02:17:27.235Z",
      //       "photo": {
      //         "original": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //         },
      //         "small": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/photos/photo-1858c635-b994-4380-b5d2-ec1a0cd49c7c-small.jpg"
      //         },
      //         "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //       },
      //       "photoId": "38800f1a-2e79-4da3-998c-8ce7c569c8d1",
      //       "requester": false,
      //       "status": "PENDING",
      //       "uuid": "95d6cf88-1728-4876-a1ff-1a48e4c6d460"
      //     },
      //     {
      //       "createdAt": "2017-06-11T02:17:27.235Z",
      //       "photo": {
      //         "original": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //         },
      //         "small": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/photos/photo-1858c635-b994-4380-b5d2-ec1a0cd49c7c-small.jpg"
      //         },
      //         "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //       },
      //       "photoId": "38800f1a-2e79-4da3-998c-8ce7c569c8d1",
      //       "requester": false,
      //       "status": "PROPOSED",
      //       "uuid": "a5d6cf88-1728-4876-a1ff-1a48e4c6d460"
      //     },
      //     {
      //       "createdAt": "2017-06-11T02:17:27.235Z",
      //       "photo": {
      //         "original": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //         },
      //         "small": {
      //           "url": "https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/photos/photo-1858c635-b994-4380-b5d2-ec1a0cd49c7c-small.jpg"
      //         },
      //         "url": "https://s3-us-west-2.amazonaws.com/echt.test.us-west-2/users/user-95d6cf88-1728-4876-a1ff-1a48e4c6d460.jpg"
      //       },
      //       "photoId": "38800f1a-2e79-4da3-998c-8ce7c569c8d1",
      //       "requester": false,
      //       "status": "ACCEPTED",
      //       "uuid": "b5d6cf88-1728-4876-a1ff-1a48e4c6d460"
      //     }
      //   ],
      //   "success": true
      // }

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
    const getDeviceKey = AsyncStorage.getItem('deviceKey').then((key) => {
      this.user.key = key;
    });

    const getLoggedIn = AsyncStorage.getItem('loggedIn').then((value) => {
      this.user.loggedIn = value === 'true';
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

    Promise.all([
      getDeviceKey,
      getLoggedIn,
      getPhotos,
      getFriends
    ]).then(() => {
      this.loaded = true;
    });
  }

  save () {
    AsyncStorage.setItem('deviceKey', this.user.key);
    AsyncStorage.setItem('loggedIn', this.user.loggedIn ? 'true' : 'false');

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

// echtStore.load();

echtStore.loadFixture(fixture);

// setTimeout(() => {
//   const upload = {
//     uuid: '1234',
//     url: 'https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/users/user-92954f8c-7798-49f2-852a-2559d443c805.jpg',
//     actions: [{
//       type: 'ADD_FRIEND',
//       user: {
//         avatar: 'https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/users/user-92954f8c-7798-49f2-852a-2559d443c805.jpg',
//         uuid: '92954f8c-7798-49f2-852a-2559d443c805'
//       }
//     }]
//   };

//   echtStore.merge(echtStore.uploads, [upload]);
// }, 1000);

// DEBUGGING ONLY - see https://corbt.com/posts/2015/12/19/debugging-with-global-variables-in-react-native.html
global.__store = echtStore;

export default echtStore;
