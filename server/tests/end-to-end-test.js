const fs = require('fs');
const Automator = require('./automator');
const test = require('tape');
const CAMERA = require('../constants').CAMERA;
const ACTION = require('../constants').ACTION;
const STATUS = require('../constants').STATUS;

function xtest () {
  test('end-to-end tests disabled', (t) => {
    t.ok(true);
    t.end();
  });
}

xtest('full user flow', (t) => {
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
      t.plan(5);

      const blob = fs.readFileSync('./fixtures/ben-1.jpg');

      a.post('/sign-up', {
        image: blob,
        name: 'Ben'
      }, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.user);
        t.ok(r.user.uuid);
        t.equal(r.user.name, 'Ben');
        t.ok();

        ben.user = r.user;

        // Devicekey now has user info in it too
        ben.deviceKey = r.deviceKey;
      });
    });

    t.test('get newsfeed', (t) => {
      t.plan(5);

      a.get('/photos', {}, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.items);
        t.equal(r.items.length, 1);
        t.equal(r.items[0].user.uuid, ben.user.uuid);
        t.ok();
      });
    });

    t.test('take selfie', (t) => {
      const blob = fs.readFileSync('./fixtures/ben-2.jpg');

      a.post('/photos', { blob: blob, camera: CAMERA.FRONT_FACING }, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.ok(r.photo);
        t.ok(r.photo.uuid);
        t.ok(r.photo.created_at);

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

      a.get('/photos', {}, { deviceKey: ben.deviceKey }, (r) => {
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

      const blob = fs.readFileSync('./fixtures/ingo-1.jpg');

      a.post('/sign-up', {
        image: blob,
        name: 'Ingo'
      }, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);
        ingo.user = r.user;
        ingo.deviceKey = r.deviceKey;
      });
    });
  });

  /* Ben friends Ingo */

  t.test('ben', (t) => {
    let photo;

    t.test('take selfie with ingo', (t) => {
      t.plan(2);

      const blob = fs.readFileSync('./fixtures/ben-ingo-1.jpg');

      a.post('/photos', { blob: blob, camera: CAMERA.FRONT_FACING }, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);

        t.equal(r.photo.actions.length, 1);
        t.equal(r.photo.actions[0].type, ACTION.ADD_FRIEND);
        t.ok(!r.photo.actions[0].user.uuid);
        t.ok(r.photo.actions[0].user.avatar);

        photo = r.photo;
      });
    });

    t.test('send friend request', (t) => {
      t.plan(4);

      a.post('/friends', { photo: photo.uuid }, { deviceKey: ben.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friend.status, STATUS.PENDING);
      });
    });

    t.test('view friend request', (t) => {
      t.plan(3);

      a.get('/friends', {}, { deviceKey: ben.deviceKey }, (r) => {
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

      a.get('/friends', {}, { deviceKey: ingo.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friends.length, 1);
        t.equal(r.friends[0].status, STATUS.PROPOSED);

        friend = r.friends[0];
      });
    });

    t.test('accept friend request', (t) => {
      t.plan(4);

      a.put('/friends', { user_id: friend.user.uuid, status: STATUS.ACCEPTED }, { deviceKey: ingo.deviceKey }, (r) => {
        t.ok(r.success);
        t.equal(r.friend.status, STATUS.ACCEPTED);
      });
    });

    // Ingo can see the selfie ben took of them both

    t.test('get newsfeed', (t) => {
      t.plan(4);

      a.get('/photos', {}, { deviceKey: ingo.deviceKey }, (r) => {
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
