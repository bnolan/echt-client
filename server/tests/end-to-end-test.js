const fs = require('fs');
const path = require('path');
const Automator = require('./automator');
const test = require('tape');
const CAMERA = require('../constants').CAMERA;
const ACTION = require('../constants').ACTION;
const STATUS = require('../constants').STATUS;

// function xtest () {
//   test();
// }

test('full user flow', (t) => {
  let ben = {
    deviceKey: null,
    user: null
  };

  const a = new Automator();

  // Is this call necessary at all? Maybe could do some
  // captcha / robot prevention in here.
  t.test('ben', (t) => {
    t.test('start signup', (t) => {
      t.plan(2);

      a.get('/sign-up', {}, {}, (r) => {
        t.ok(r.success);
        t.ok(r.deviceKey);

        ben.deviceKey = r.deviceKey;
      });
    });

    t.test('complete signup', (t) => {
      t.plan(6);

      const image = fs.readFileSync(path.join(__dirname, './fixtures/ben-1.jpg'));
      const b64 = new Buffer(image).toString('base64');

      a.post('/sign-up', {
        image: b64,
        name: 'Ben'
      }, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.user);
        t.ok(r.user.uuid);
        t.ok(r.user.photo.url);
        t.ok(r.user.photo.small.url);
        t.equal(r.user.name, 'Ben');

        ben.user = r.user;

        // Devicekey now has user info in it too
        ben.deviceKey = r.deviceKey;

        console.log('ben deviceKey:');
        console.log(r.deviceKey);
      });
    });

    t.test('get newsfeed', (t) => {
      t.plan(4);

      a.get('/photos', {}, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.items);
        t.equal(r.items.length, 1);
        t.equal(r.items[0].user.uuid, ben.user.uuid);
      });
    });

    t.test('take selfie', (t) => {
      t.plan(9);

      const image = fs.readFileSync(path.join(__dirname, './fixtures/ben-2.jpg'));
      const b64 = new Buffer(image).toString('base64');

      a.post('/photos', { image: b64, camera: CAMERA.FRONT_FACING }, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.photo);
        t.ok(r.photo.uuid);
        t.ok(r.photo.createdAt);

        t.ok(r.photo.info);
        t.equal(r.photo.info.camera, CAMERA.FRONT_FACING);

        t.ok(r.photo.user);
        t.equal(r.photo.user.uuid, ben.user.uuid);

        // Not a selfie with friends, so no actions
        t.equal(r.photo.actions.length, 0);
      });
    });

    t.test('get newsfeed again', (t) => {
      t.plan(5);

      a.get('/photos', {}, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.items);
        t.equal(r.items.length, 2);
        t.equal(r.items[0].user.uuid, ben.user.uuid);
        t.equal(r.items[1].user.uuid, ben.user.uuid);
      });
    });
  });

  /* A wild Ingo appears! */

  let ingo = {
    deviceKey: null,
    user: null
  };

  t.test('ingo', (t) => {
    t.test('signup', (t) => {
      t.plan(2);

      a.get('/sign-up', {}, {}, (r) => {
        t.ok(r.success);
        ingo.deviceKey = r.deviceKey;
      });

      const image = fs.readFileSync(path.join(__dirname, './fixtures/ingo-1.jpg'));
      const b64 = new Buffer(image).toString('base64');

      a.post('/sign-up', {
        image: b64,
        name: 'Ingo'
      }, { 'X-DeviceKey': ingo.deviceKey }, (r) => {
        t.ok(r.success);
        ingo.user = r.user;
        ingo.deviceKey = r.deviceKey;

        console.log('ingo deviceKey:');
        console.log(r.deviceKey);
      });
    });
  });

  /* Ben friends Ingo */

  t.test('ben', (t) => {
    let photo;

    t.test('take selfie with ingo', (t) => {
      t.plan(5);

      const image = fs.readFileSync(path.join(__dirname, './fixtures/ben-ingo-1.jpg'));
      const b64 = new Buffer(image).toString('base64');

      a.post('/photos', { image: b64, camera: CAMERA.FRONT_FACING }, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);

        t.equal(r.photo.actions.length, 1);
        t.equal(r.photo.actions[0].type, ACTION.ADD_FRIEND);
        t.ok(!r.photo.actions[0].user.uuid);
        t.ok(r.photo.actions[0].user.avatar);

        photo = r.photo;
      });
    });

    t.test('send friend request', (t) => {
      t.plan(2);

      a.post('/friends', { photo: photo.uuid }, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friend.status, STATUS.PENDING);
      });
    });

    t.test('view friend request', (t) => {
      t.plan(3);

      a.get('/friends', {}, { 'X-DeviceKey': ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friends.length, 1);
        t.equal(r.friends[0].status, STATUS.PENDING);
      });
    });
  });

  /* Ingo accepts request */

  t.test('ingo', (t) => {
    // fixme - get the notification from some endpoint instead of
    // cheating and using bens uuid directly

    let friend;

    t.test('view pending request', (t) => {
      t.plan(3);

      a.get('/friends', {}, { 'X-DeviceKey': ingo.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friends.length, 1);
        t.equal(r.friends[0].status, STATUS.PROPOSED);

        friend = r.friends[0];
      });
    });

    t.test('accept friend request', (t) => {
      t.plan(4);

      a.put('/friends', { user_id: friend.user.uuid, status: STATUS.ACCEPTED }, { 'X-DeviceKey': ingo.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friend.status, STATUS.ACCEPTED);
      });
    });

    // Ingo can see the selfie ben took of them both

    t.test('get newsfeed', (t) => {
      t.plan(4);

      a.get('/photos', {}, { 'X-DeviceKey': ingo.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.items.length, 2);

        // Photos are sorted newest -> oldest
        t.equal(r.items[0].user.uuid, ben.user.uuid);
        t.equal(r.items[1].user.uuid, ingo.user.uuid);
      });
    });

    // Ingo takes a photo of hashigo zake

    // ...
  });
});
