const AWS = require('aws-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const getStage = require('../helpers/get-stage');
const resize = require('../helpers/resize');

const BUCKET = 'echt.uat.us-west-2';
const S3 = new AWS.S3();

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
        Bucket: BUCKET, // `echt.${stage}.${region}`,
        Name: objectKey
      }
    }
  };
  return rekognitionClient.indexFaces(params).promise().then((response) => {
    console.log(JSON.stringify(response));

    // TODO Fail when more than one face detected
    // TODO Limit multi face failure to similar bounding boxes,
    // avoid failing when photo captures people in the background
    // TODO Fail when face is detected with low confidence
    return response.FaceRecords[0].Face.FaceId;
  });
};

/**
 * @param {Object} photo
 * @param {String} stage
 * @return {Promise}
 */
var storePhoto = (photo, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: `echt.${stage}.photos`,
    Item: photo
  };

  return docClient.put(params).promise().then((response) => {
    return response;
  });
};

/**
 * @param {Object} user
 * @param {String} objectKey S3 object key (not a URL)
 * @param {String} faceId AWS Rekognition detected face
 * @param {String} env Environment stage (dev, uat, prod)
 * @return {Promise} Returning doc info
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
  */

exports.handler = function (request) {
  // const photoKey = request.body.photoKey;

  const stage = getStage(request.lambdaContext);

  // fixme - use verify with a key
  const deviceKey = jwt.decode(request.headers['x-devicekey']);

  // Get buffer from json payload
  const buffer = new Buffer(request.body.image, 'base64');

  // Start constructing photo record
  var photo = {
    uuid: uuid(),
    author: {
      uuid: deviceKey.userId
    },
    createdAt: new Date().toISOString(),
    info: {
      camera: request.body.camera
    }
  };

  let uploads;

  return resize.toSmall(buffer).then((smallBuffer) => {
    var originalPhoto = {
      Bucket: BUCKET,
      Key: `photos/photo-${photo.uuid}-original.jpg`,
      ContentType: 'image/jpeg',
      Body: buffer
    };

    var smallPhoto = {
      Bucket: BUCKET,
      Key: `photos/photo-${photo.uuid}-small.jpg`,
      ContentType: 'image/jpeg',
      Body: smallBuffer
    };

    uploads = [
      S3.upload(originalPhoto).promise(),
      S3.upload(smallPhoto).promise()
    ];

    return resize.toInline(smallBuffer);
  }).then((base64) => {
    // Set the inline content
    photo.inline = {
      url: `data:image/jpg;base64,${base64}`
    };

    // Do both uploads in parallel
    return Promise.all(uploads);
  }).then((values) => {
    var original = values[0];
    var small = values[1];

    photo.url = {
      url: original.Location
    };
    photo.original = {
      url: original.Location
    };
    photo.small = {
      url: small.Location
    };

    return indexFace(original.key, stage);
  }).then((faceData) => {
    console.log(faceData);

    photo.faceData = faceData;
  }).then(() => {
    // todo - iterate over friends and fan out to the photos
    // table using batchPut
    photo.userId = deviceKey.userId;

    return storePhoto(photo, stage);
  }).then(() => {
    return {
      success: true,
      photo: Object.assign(photo, {
        actions: []
      })
    };
  });

  // return indexFace(photoKey, stage)
  //   .then(faceData => {
  //     return storeDoc(user, photoKey, faceData, stage);
  //   })
  //   .then(() => {
  //     // TODO Return object information in API response
  //     return {status: 'ok'};
  //   });
};
