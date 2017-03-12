const test = require('tape');
const timeline = require('../handlers/timeline');

test('scan', function (t) {
  t.plan(2);

  timeline.handler().then((result) => {
    t.ok(result);
    t.ok(result['items']);
  });
});
