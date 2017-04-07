const AWS = require('aws-sdk');
const getStage = require('../helpers/get-stage');
const jwt = require('jsonwebtoken');
const STATUS = require('../constants').STATUS;
const config = require('../config');
const assert = require('assert');

AWS.config.update({
  region: config.awsRegion
});

var stage;

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
    console.log('#updateRequest');
    console.log(friend);
    return friend;
  });
};

exports.handler = (request) => {
  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  assert(request.body.uuid);

  return updateRequest(deviceKey.userId, request.body.uuid, STATUS.ACCEPTED)
    .then((friend) => {
      return {
        success: true,
        friend: friend
      };
    });
};
