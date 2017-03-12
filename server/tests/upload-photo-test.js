const test = require('tape');
const uploadPhoto = require('../handlers/upload-photo');

test('scan', function (t) {
  t.plan(1);

  uploadPhoto.handler().then((result) => {
    t.ok(result);
  });
});
