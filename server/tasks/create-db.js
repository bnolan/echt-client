var AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-2'
  // endpoint: 'http://127.0.0.1:8000'
});

var dynamodb = new AWS.DynamoDB();

var params = {
  TableName: 'echt.uat.photos',
  KeySchema: [
    { AttributeName: 'uuid', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'uuid', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});
