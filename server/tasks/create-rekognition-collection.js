var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2'
});

var collections = ['echt.uat', 'echt.prod'];

var rekognition = new AWS.Rekognition();
collections.forEach((collection) => {
  rekognition.createCollection({CollectionId: collection}, function (err, data) {
    if (err) {
      console.error('Unable to create collection. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created rekognition collection: ', collection);
    }
  });
});
