var AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
  region: config.awsRegion
  // endpoint: 'http://127.0.0.1:8000'
});

var dynamodb = new AWS.DynamoDB();

function create (params) {
  return dynamodb.createTable(params).promise();
}

function drop (params, callback) {
  dynamodb.deleteTable(params).promise();
}

const createUsers = (stage) => {
  return create({
    TableName: `echt.${stage}.users`,
    KeySchema: [
      { AttributeName: 'uuid', KeyType: 'HASH' },
      { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'uuid', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  });
};

const createPhotos = (stage) => {
  return create({
    TableName: `echt.${stage}.photos`,
    KeySchema: [
      { AttributeName: 'uuid', KeyType: 'HASH' },
      { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'uuid', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  });
};

const createFaces = (stage) => {
  return create({
    TableName: `echt.${stage}.faces`,
    KeySchema: [
      { AttributeName: 'faceId', KeyType: 'HASH' },
      { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'faceId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  });
};

const createFriends = (stage) => {
  return create({
    TableName: `echt.${stage}.friends`,
    KeySchema: [
      { AttributeName: 'fromId', KeyType: 'HASH' },
      { AttributeName: 'toId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'fromId', AttributeType: 'S' },
      { AttributeName: 'toId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  });
};

const dropFaces = (stage) => {
  return drop({
    TableName: `echt.${stage}.faces`
  });
};

const emptyFaces = (stage) => {
  return dynamodb.scan({
    TableName: `echt.${stage}.faces`
  })
    .promise()
    .then(data => {
      const requests = data.Items.map(item => {
        return {
          DeleteRequest: {
            Key: {
              faceId: item.faceId,
              userId: item.userId
            }
          }
        };
      });
      if (requests.length) {
        return dynamodb.batchWriteItem({
          RequestItems: {
            [`echt.${stage}.faces`]: requests
          }
        }).promise();
      } else {
        return Promise.resolve();
      }
    });
};

module.exports = {
  createUsers, createPhotos, createFaces, createFriends, dropFaces, emptyFaces
};
