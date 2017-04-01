const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const getStage = require('../helpers/get-stage');
const STATUS = require('../constants').STATUS;

// TODO Move to environment var
const region = 'us-west-2';

AWS.config.update({
  region: region
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
  // const photoKey = request.body.photoKey;
  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  // Start constructing friend record
  var friend = {
    fromId: deviceKey.userId,
    toId: request.body.user,
    createdAt: new Date().toISOString(),
    status: STATUS.PENDING
  };

  return storeFriend(friend, stage)
    .then(() => {
      return {
        success: true,
        friend: {
          uuid: friend.toId,
          status: friend.status
        }
      };
    });
};
