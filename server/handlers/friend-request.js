const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const getStage = require('../helpers/get-stage');
const STATUS = require('../constants').STATUS;
const config = require('../config');
const assert = require('assert');
const addErrorReporter = require('../helpers/error-reporter');

AWS.config.update({
  region: config.awsRegion
});

var stage;

/**
 * @param {Object} friend
 * @param {String} stage
 * @return {Promise}
 */
var storeFriend = (friend) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.friends`,
    Item: friend
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

// todo - post to FriendRequests table

exports.handler = function (request) {
  const errorHandlers = addErrorReporter(request);

  // const photoKey = request.body.photoKey;
  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  assert(request.body.user);
  assert(request.body.photoId);

  // Allow status override for testing purposes
  // TODO Replace with user.isAdmin permission check
  const status = request.body._status || STATUS.PENDING;

  // Start constructing friend record
  var friend = {
    fromId: deviceKey.userId,
    toId: request.body.user,
    photoId: request.body.photoId,
    createdAt: new Date().toISOString(),
    status: status
  };

  // Todo - check friend and photo exists

  return storeFriend(friend, stage)
    .then(() => {
      return {
        success: true,
        friend: {
          uuid: friend.toId,
          status: friend.status
        }
      };
    })
    .catch(errorHandlers.catchPromise);
};
