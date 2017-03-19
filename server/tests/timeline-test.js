const test = require('tape');
const timeline = require('../handlers/timeline');

test('scan', function (t) {
  t.plan(2);

  const request = {};
  timeline.handler(request).then((result) => {
    t.ok(result);
    t.ok(result['items']);
  });
});
