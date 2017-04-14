const AWS = require('aws-sdk');
const getStage = require('../helpers/get-stage');
const jwt = require('jsonwebtoken');
const STATUS = require('../constants').STATUS;
const config = require('../config');
const assert = require('assert');
const addErrorReporter = require('../helpers/error-reporter');

AWS.config.update({
  region: config.awsRegion
});

var stage;

var storePhoto = (photo) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.photos`,
    Item: photo
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

const addPhotoToNewsfeed = (userId, photoId) => {
  const params = {
    TableName: `echt.${stage}.photos`,
    FilterExpression: '#uuid = :photoId',
    ExpressionAttributeNames: {
      '#uuid': 'uuid'
    },
    ExpressionAttributeValues: {
      ':photoId': photoId
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient.scan(params).promise().then((data) => {
    const item = data.Items[0];
    item.userId = userId;
    return storePhoto(item);
  });
};

const getRequest = (toId, fromId) => {
  const params = {
    TableName: `echt.${stage}.friends`,
    FilterExpression: 'fromId = :fromId AND toId = :toId',
    ExpressionAttributeValues: {
      ':fromId': fromId,
      ':toId': toId
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient.scan(params).promise().then((data) => {
    const item = data.Items[0];
    item.uuid = item.fromId;
    delete item.fromId;
    delete item.toId;
    return item;
  });
};

const updateRequest = (toId, fromId, status) => {
  const params = {
    TableName: `echt.${stage}.friends`,
    Key: {
      'fromId': fromId,
      'toId': toId
    },
    UpdateExpression: 'set #status=:status',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': status
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient.update(params).promise().then((data) => {
    return getRequest(toId, fromId);
  }).then((friend) => {
    return friend;
  });
};

exports.handler = (request) => {
  const errorHandlers = addErrorReporter(request);

  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  assert(request.body.uuid);

  var friend;

  return updateRequest(deviceKey.userId, request.body.uuid, STATUS.ACCEPTED)
    .then((result) => {
      friend = result;

      // Share the selfie photo to your newsfeed
      return addPhotoToNewsfeed(deviceKey.userId, result.photoId);
    })
    .then(() => {
      return {
        success: true,
        friend: friend
      };
    })
    .catch(errorHandlers.catchPromise);
};
