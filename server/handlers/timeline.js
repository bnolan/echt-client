var AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-2'
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (request) => {
  var params = {
    TableName: 'echt.uat.photos'
  };

  return docClient.scan(params).promise().then((data) => {
    return { items: data.Items };
  });
};
