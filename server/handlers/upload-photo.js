const AWS = require('aws-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const getStage = require('../helpers/get-stage');
const resize = require('../helpers/resize');
const _ = require('lodash');

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
 * Does not store the face. Only the origina sign-up photo face gets stored,
 * in order to keep things simple for the moment.
 *
 * @param {String} objectKey S3 object (not a URL)
 * @param {String} stage Environment stage (dev, uat, prod)
 * @return {Promise} Returning a FaceId
 */
var detectFaces = (objectKey, stage) => {
  var rekognitionClient = new AWS.Rekognition();
  var params = {
    Image: {
      S3Object: {
        // Ensure photos can only be selected from a location we control
        Bucket: BUCKET, // `echt.${stage}.${region}`,
        Name: objectKey
      }
    }
  };
  return rekognitionClient.detectFaces(params).promise().then((response) => {
    // TODO Fail when no faces are detected with reasonable confidence
    return response;
  });
};

/**
 * Finds the best match for a previously indexed face.
 *
 * @param {Object} faceRecord
 * @param {String} buffer
 * @param {String} stage
 * @return {Promise} Returning a searchFacesByImage result
 */
var searchFacesByCroppedImage = (faceRecord, buffer, stage) => {
  var rekognitionClient = new AWS.Rekognition();
  return resize.cropByBoundingBox(buffer, faceRecord.BoundingBox)
    .then(croppedImageStr => {
      var params = {
        CollectionId: `echt.${stage}`,
        Image: {
          Bytes: new Buffer(croppedImageStr, 'base64')
        },
        FaceMatchThreshold: 50,
        MaxFaces: 1

      };
      return rekognitionClient.searchFacesByImage(params).promise().then((response) => {
        console.log('#searchFacesByCroppedImage:');
        console.log(response);
        return response;
      });
    });
};

/**
 * @param {Object} photo
 * @param {String} stage
 * @return {Promise}
 */
var getUserIdsForFace = (faceId, stage) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log('#getUserIdsForFace');
  console.log(faceId);

  var params = {
    TableName: `echt.${stage}.faces`,
    KeyConditionExpression: 'faceId = :faceId',
    ExpressionAttributeValues: {
      ':faceId': faceId
    }
  };

  return docClient.query(params).promise().then((response) => {
    console.log('#getUserIdsForFace response:');
    console.log(response);

    if (response.Items.length > 0) {
      return response.Items[0].userId;
    }
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

  // TODO Better way to get user identifeir
  const userId = deviceKey.userId;

  var uploads;

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

    return detectFaces(original.key, stage);
  }).then((response) => {
    // console.log('detectFaces', JSON.stringify(response));
    photo.faceData = response;

    // TODO Only count "major" faces
    const detectedFacesCount = response.FaceDetails.length;

    photo.hasFaces = (detectedFacesCount > 0);

    // Only continue if the photo is a potential selfie,
    // or has exactly two faces in it (friendship request)
    if (detectedFacesCount === 0 || detectedFacesCount > 2) {
      return null;
    }

    // Search for matching faces for each face
    const faceLookups = response.FaceDetails.map((faceRecord) => {
      return searchFacesByCroppedImage(faceRecord, buffer, stage)
        .then(response => {
          if (!response.FaceMatches.length) {
            return null;
          }

          console.log('searchFacesByCroppedImage', JSON.stringify(response.FaceMatches[0]));

          if (response.FaceMatches.length > 0) {
            return response.FaceMatches[0].Face.FaceId;
          }
        }).then(faceId => {
          if (faceId) {
            return getUserIdsForFace(faceId, stage);
          }
        });
    });

    return Promise.all(faceLookups);
  }).then((userIds) => {
    // Note that null entries in userIds are significant for the amount
    // of originally detected faces (even though they don't have a user match)
    console.log('userIds', userIds);

    if (userIds.length === 1) {
      // Potential selfie
      if (userIds[0] === userId) {
        photo.isSelfie = true;
      }
    } else if (userIds.length === 2) {
      // Potential friendship request
      const me = _.find(userIds, userId);
      const friend = _.without(userIds, userId)[0];

      if (me && friend) {
        console.log('FRIENDING!');
      }
    }

    // TODO Iterate over friends and fan out to the photos
    // table using batchPut
    photo.userId = userId;

    return storePhoto(photo, stage);
  }).then(() => {
    return {
      success: true,
      photo: Object.assign(photo, {
        actions: []
      })
    };
  });
};
