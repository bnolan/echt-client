const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
  region: 'ap-southeast-2'
});

// TODO Determine from API Gateway stage
const stage = 'uat';

/**
 * Analyses a photo for faces. The photo was previously uploaded
 * to a defined S3 bucket by the same user.
 *
 * @param {String} objectKey S3 object (not a URL)
 * @return {Promise} Returning a FaceId
 */
var indexFace = (objectKey) => {
  var rekognitionClient = new AWS.Rekognition();
  var params = {
    Image: {
     S3Object: {
       // Ensure photos can only be selected from a location we control
       Bucket: `echt.${stage}`,
       Name: objectKey
     }
    }
  };
  return rekognitionClient.indexFaces(params).promise().then((response) => {
    // TODO Fail when more than one face detected
    // TODO Limit multi face failure to similar bounding boxes,
    // avoid failing when photo captures people in the background
    // TODO Fail when face is detected with low confidence
    return response.data.FaceRecords[0].Face.FaceId;
  });
}

/**
 * @param {Object} user
 * @param {String} objectKey S3 object key (not a URL)
 * @param {String} faceId AWS Rekognition detected face
 * @return {Promise} Returning doc info
 */
var storeDoc = (user, objectKey, faceId) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: `echt.${stage}.photos`,
    Item: {
      uuid: uuid.v1(),
      userId: user.uuid,
      faceId: faceId,
    }
  };

  return docClient.put(params).promise().then((response) => {
    return response.data;
  });
}

exports.handler = function (request) {
  const photoKey = request.body.photoKey;

  // TODO Check user existence in database
  const user = request.body.user;

  return indexFace(photoKey)
    .then(faceData => {
      return storeDoc(user, photoKey, faceData);
    })
    .then(() => {
      // TODO Return object information in API response
      return {status: 'ok'};
    });
};
