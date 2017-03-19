const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const {ACCOUNT} = require('../constants');
const getStage = require('../helpers/get-stage');

/**
 * @param {Object} user
 * @param {String} stage
 * @return {Promise}
 */
var storeDoc = (user, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.users`,
    Item: {
      uuid: user.uuid,
      user: user
    }
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
function generateRegisteredKey (user, deviceId) {
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
  const key = jwt.decode(request.headers.deviceKey);

  const user = {
    uuid: uuid(),
    name: request.body.name,
    status: ACCOUNT.REGISTERED
  };

  const newKey = generateRegisteredKey(user, key);
  const stage = getStage(request.lambdaContext);
  return storeDoc(user, stage).then(() => {
    return {
      success: true,
      deviceKey: newKey,
      user: user
    };
  });
};
