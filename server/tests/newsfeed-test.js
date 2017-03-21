const test = require('tape');
const newsfeed = require('../handlers/newsfeed');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const deviceKey = jwt.sign({
  userId: uuid(),
  deviceId: uuid()
}, '', {
  algorithm: 'none'
});

test('scan', function (t) {
  t.plan(2);

  const request = {
    headers: { deviceKey }
  };

  newsfeed.handler(request).then((result) => {
    t.ok(result);
    t.ok(result['items']);
  });
});
