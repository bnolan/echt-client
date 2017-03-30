var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2'
  // endpoint: 'http://127.0.0.1:8000'
});

var dynamodb = new AWS.DynamoDB();

function create (params, callback) {
  dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));

      if (callback) {
        callback(null);
      }
    }
  });
}

function drop (params, callback) {
  dynamodb.deleteTable(params, function (err, data) {
    if (err) {
      console.error('Unable to drop table. Error JSON:', JSON.stringify(err, null, 2));

      if (callback) {
        callback(null);
      }
    } else {
      console.log(`Dropped table ${params.TableName}.`);

      if (callback) {
        callback(null);
      }
    }
  });
}

const createUsers = (stage, callback) => {
  create({
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
  }, callback);
};

const createPhotos = (stage, callback) => {
  create({
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
  }, callback);
};

const createFaces = (stage, callback) => {
  create({
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
  }, callback);
};

const dropFaces = (stage, callback) => {
  drop({
    TableName: `echt.${stage}.faces`
  }, callback);
};

const createAllTables = () => {
  var stages = ['dev', 'uat', 'prod'];

  stages.forEach(stage => {
    // users
    createUsers(stage);

    // photos
    createPhotos(stage);

    // faces
    createFaces(stage);
  });
};

module.exports = {
  createAllTables, createUsers, createPhotos, createFaces, dropFaces
};
