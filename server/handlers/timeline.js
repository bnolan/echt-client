var AWS = require('aws-sdk');
const getStage = require('../helpers/get-stage');
const jwt = require('jsonwebtoken');

// TODO Move to environment var
// Region needs to be supported by Rekognition (and match the S3 bucket)
const region = 'us-west-2';

AWS.config.update({
  region: region
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (request) => {
  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers.deviceKey);

  const stage = getStage(request.lambdaContext);
  const params = {
    TableName: `echt.${stage}.photos`,
    Key: {
      userId: deviceKey.userId
    }
    // FilterExpression: 'userId IN (:friends)',
    // ExpressionAttributeValues: {
    //   ':friends': ['4278f790-070e-11e7-98f6-d72bef2d4021', '7b545370-070e-11e7-aa98-35a1c7d1e25c']
    // }
  };

  return docClient.scan(params).promise().then((data) => {
    return { items: data.Items };
  });
};
