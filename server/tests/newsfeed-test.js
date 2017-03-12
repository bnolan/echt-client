const test = require('tape');
const newsfeed = require('../newsfeed');

test('query', function (t) {
  t.plan(2);

  newsfeed.handler({}).then((result) => {
    t.ok(result);
    t.ok(result['items']);
  });
});
