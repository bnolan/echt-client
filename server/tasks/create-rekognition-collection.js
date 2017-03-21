var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2'
});

var stages = ['dev', 'uat', 'prod'];

var rekognition = new AWS.Rekognition();
stages.forEach((stage) => {
  rekognition.createCollection({CollectionId: `echt.${stage}`}, function (err, data) {
    if (err) {
      console.error('Unable to create collection. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created rekognition collection: ', data);
    }
  });
});
