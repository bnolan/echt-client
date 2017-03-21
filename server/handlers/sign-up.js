const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const {ACCOUNT} = require('../constants');
const getStage = require('../helpers/get-stage');
const promisify = require('es6-promisify');
const tempfile = require('tempfile');
const im = require('imagemagick');
const fs = require('fs');

const BUCKET = 'echt.uat.us-west-2';
const S3 = new AWS.S3();

/**
 * @param {Object} user
 * @param {String} stage
 * @return {Promise}
 */
var storeUser = (user, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.users`,
    Item: {
      userId: user.uuid,
      uuid: user.uuid,
      user: user
    }
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

/**
 * @param {Object} photo
 * @param {String} stage
 * @return {Promise}
 */
var storePhoto = (photo, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.photos`,
    Item: photo
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

/**
 * @param {Object} user
 * @param {String} deviceId
 * @return {String}
 */
function generateRegisteredKey (user) {
  // fixme - sign jwt with a key

  return jwt.sign({
    userId: user.uuid,
    deviceId: uuid(),
    status: user.STATUS
  }, '', {
    algorithm: 'none'
  });
}

exports.handler = (request) => {
  // fixme - use verify with a key
  // const userKey = jwt.decode(request.headers.deviceKey);

  const user = {
    uuid: uuid(),
    name: request.body.name,
    status: ACCOUNT.REGISTERED
  };

  const newKey = generateRegisteredKey(user);
  const stage = getStage(request.lambdaContext);

  var buffer = Buffer.from(request.body.image, 'base64');

  var params = {
    Bucket: BUCKET,
    Key: `users/user-${user.uuid}.jpg`,
    ContentType: 'image/jpeg',
    Body: buffer
  };

  const original = tempfile('.jpg');
  const small = tempfile('.jpg');

  return S3.upload(params).promise().then((data) => {
    user.photo = {
      url: data.Location,

      original: {
        url: data.Location
      }
    };

    const crop = promisify(im.crop);
    fs.writeFileSync(original, buffer);
    return crop({
      srcPath: original,
      dstPath: small,
      width: 256,
      height: 256,
      quality: 1
    });
  }).then((stdout) => {
    buffer = fs.readFileSync(small);

    params = {
      Bucket: BUCKET,
      Key: `users/user-${user.uuid}-small.jpg`,
      ContentType: 'image/jpeg',
      Body: buffer
    };

    return S3.upload(params).promise();
  }).then((data) => {
    user.photo.small = {
      url: data.Location
    };

    return storeUser(user, stage);
  }).then(() => {
    const photo = {
      uuid: uuid(),
      userId: user.uuid,
      Item: {
        user: user,
        createdAt: new Date().toISOString()
      }
    };

    return storePhoto(photo, stage);
  }).then(() => {
    return {
      success: true,
      deviceKey: newKey,
      user: user
    };
  });
};