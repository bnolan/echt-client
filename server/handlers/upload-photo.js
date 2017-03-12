const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
  region: 'ap-southeast-2'
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context) {
  const user = {
    uuid: uuid.v1()
  };

  var params = {
    TableName: 'echt.uat.photos',
    Item: {
      'uuid': uuid.v1(),
      'author_id': user.uuid,
      'info': {
        'test': 'This is a test post'
      }
    }
  };

  return docClient.put(params).promise().then((data) => {
    return data;
  });
};
