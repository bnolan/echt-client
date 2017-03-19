const AWS = require('aws-sdk');
const uuid = require('uuid');
const getStage = require('../helpers/get-stage');

// TODO Move to environment var
// Region needs to be supported by Rekognition (and match the S3 bucket)
const region = 'us-west-2';

AWS.config.update({
  region: region
});

/**
 * Analyses a photo for faces. The photo was previously uploaded
 * to a defined S3 bucket by the same user.
 *
 * @param {String} objectKey S3 object (not a URL)
 * @param {String} env Environment stage (dev, uat, prod)
 * @return {Promise} Returning a FaceId
 */
var indexFace = (objectKey, stage) => {
  var rekognitionClient = new AWS.Rekognition();
  var params = {
    CollectionId: `echt.${stage}`,
    Image: {
      S3Object: {
        // Ensure photos can only be selected from a location we control
        Bucket: `echt.${stage}.${region}`,
        Name: objectKey
      }
    }
  };
  return rekognitionClient.indexFaces(params).promise().then((response) => {
    // TODO Fail when more than one face detected
    // TODO Limit multi face failure to similar bounding boxes,
    // avoid failing when photo captures people in the background
    // TODO Fail when face is detected with low confidence
    return response.FaceRecords[0].Face.FaceId;
  });
};

/**
 * @param {Object} user
 * @param {String} objectKey S3 object key (not a URL)
 * @param {String} faceId AWS Rekognition detected face
 * @param {String} env Environment stage (dev, uat, prod)
 * @return {Promise} Returning doc info
 */
var storeDoc = (user, objectKey, faceId, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: `echt.${stage}.photos`,
    Item: {
      uuid: uuid.v1(),
      userId: user.uuid,
      faceId: faceId
    }
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

exports.handler = function (request) {
  const photoKey = request.body.photoKey;

  // TODO Check user existence in database
  const user = request.body.user;

  const stage = getStage(request.lambdaContext);

  return indexFace(photoKey, stage)
    .then(faceData => {
      return storeDoc(user, photoKey, faceData, stage);
    })
    .then(() => {
      // TODO Return object information in API response
      return {status: 'ok'};
    });
};
