const AWS = require('aws-sdk');
const getStage = require('../helpers/get-stage');
const jwt = require('jsonwebtoken');
const STATUS = require('../constants').STATUS;
const _ = require('lodash');
const config = require('../config');
const addErrorReporter = require('../helpers/error-reporter');

AWS.config.update({
  region: config.awsRegion
});

var stage;

const getFriends = (uuid) => {
  const params = {
    TableName: `echt.${stage}.friends`,
    FilterExpression: 'fromId = :id',
    ExpressionAttributeValues: {
      ':id': uuid
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient.scan(params).promise().then((data) => {
    return data.Items;
  });
};

const getProposals = (uuid) => {
  const params = {
    TableName: `echt.${stage}.friends`,
    FilterExpression: 'toId = :id',
    ExpressionAttributeValues: {
      ':id': uuid
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient.scan(params).promise().then((data) => {
    data.Items.forEach((friend) => {
      if (friend.status === STATUS.PENDING) {
        // Pending requests to us we call proposed requests
        friend.status = STATUS.PROPOSED;
        friend.uuid = friend.fromId;
        delete friend.toId;
        delete friend.fromId;
      }
    });

    return data.Items;
  });
};

exports.handler = (request) => {
  const errorHandlers = addErrorReporter(request);

  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  const queries = [getFriends(deviceKey.userId), getProposals(deviceKey.userId)];

  return Promise.all(queries).then((results) => {
    // todo - concatenate friends from user object

    var friends = _.flatten(results);
    friends = _.compact(friends);

    return {
      success: true,
      friends: friends
    };
  })
  .catch(errorHandlers.catchPromise);
};
