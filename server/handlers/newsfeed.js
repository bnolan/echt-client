var AWS = require('aws-sdk');
const getStage = require('../helpers/get-stage');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// TODO Move to environment var
// Region needs to be supported by Rekognition (and match the S3 bucket)
const region = 'us-west-2';

AWS.config.update({
  region: region
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (request) => {
  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  const stage = getStage(request.lambdaContext);

  const params = {
    TableName: `echt.${stage}.photos`,
    FilterExpression: 'userId = :id',
    ExpressionAttributeValues: {
      ':id': deviceKey.userId
    }
  };

  return docClient.scan(params).promise().then((data) => {
    return {
      success: true,
      items: _.sortBy(data.Items, (i) => {
        return 0 - new Date(i.createdAt).getTime();
      })
    };
  });
};
