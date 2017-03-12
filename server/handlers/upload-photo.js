const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
  region: 'ap-southeast-2'
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context) {
  const user = {
    uuid: Math.random() < 0.5 ? '4278f790-070e-11e7-98f6-d72bef2d4021' : '7b545370-070e-11e7-aa98-35a1c7d1e25c'
  };

  var params = {
    TableName: 'echt.uat.photos',
    Item: {
      'uuid': uuid.v1(),
      'userId': user.uuid,
      'info': {
        'test': 'This is a test post'
      }
    }
  };

  return docClient.put(params).promise().then((data) => {
    return data;
  });
};
