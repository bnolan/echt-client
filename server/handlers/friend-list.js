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
    data.Items.forEach(friend => {
      friend.uuid = friend.toId;
      delete friend.toId;
      delete friend.fromId;
    });

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

/**
 * @param {Array} friends Object with uuid attribute
 * @return {Array} Matching users records
 */
const getUsersForFriends = (friends) => {
  const table = `echt.${stage}.users`;
  const uuids = _.uniq(friends.map(friend => friend.uuid));
  const keys = uuids.map(uuid => {
    return {
      uuid: uuid,
      userId: uuid
    };
  });
  const params = {
    RequestItems: {
      [table]: {
        Keys: keys
      }
    }
  };

  const docClient = new AWS.DynamoDB.DocumentClient();
  return docClient.batchGet(params).promise().then((data) => {
    return data.Responses[table];
  });
};

exports.handler = (request) => {
  const errorHandlers = addErrorReporter(request);

  stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  // Closed over because ... broken promises
  var friends;

  const queries = [getFriends(deviceKey.userId), getProposals(deviceKey.userId)];

  return Promise.all(queries)
    .then(responses => {
      friends = _.flatten(responses);
      friends = _.compact(friends);
      return getUsersForFriends(friends);
    })
    .then(users => {
      return friends.map(friend => {
        const record = _.find(users, {uuid: friend.uuid});
        if (record) {
          friend.user = record.user;
        }
        return friend;
      });
    })
    .then(friendsWithUsers => {
      return {
        success: true,
        friends: friendsWithUsers
      };
    })
    .catch(errorHandlers.catchPromise);
};
