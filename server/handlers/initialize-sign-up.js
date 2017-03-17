const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

// This might be used for doing robot / captcha stuff, or something
// else, or it might be deleted as a waste of time.
function generateDeviceKey () {
  // fixme - sign jwt with a key

  return jwt.sign({
    deviceId: uuid()
  }, '', {
    algorithm: 'none'
  });
}

exports.handler = (request) => {
  return {
    success: true,
    deviceKey: generateDeviceKey()
  };
};
