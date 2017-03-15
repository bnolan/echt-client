const proxyquire = require('proxyquire');
const test = require('tape');
const sinon = require('sinon');

const configStub = {
  update: sinon.stub()
};

const dynamoPutStub = sinon.stub().returns({
  promise: () => Promise.resolve({
    data: {
      Attributes: {}
    }
  })
});

const dynamoStub = {
  DocumentClient: function DocumentClient () {
    this.put = dynamoPutStub;
  }
};

const rekognitionIndexFacesStub = sinon.stub().returns({
  promise: () => Promise.resolve({
    data: {
      FaceRecords: [
        {
          Face: {
            BoundingBox: {
              Height: 0.3,
              Left: 0.3,
              Top: 0.3,
              Width: 0.3
            },
            Confidence: 99.99,
            FaceId: 'my-faceid',
            ImageId: 'my-imageid'
          }
        }
      ]
    }
  })
});

const rekognitionStub = function Rekognition () {
  this.indexFaces = rekognitionIndexFacesStub;
};

const awsStub = {
  config: configStub,
  DynamoDB: dynamoStub,
  Rekognition: rekognitionStub
};

const uploadPhoto = proxyquire('../handlers/upload-photo', {
  'aws-sdk': awsStub
});

test('stores when called with valid object and a detected face', function (t) {
  const request = {
    body: {
      photoKey: 'my-photo-key.jpg',
      user: {
        uuid: 'my-uuid'
      }
    }
  };
  uploadPhoto.handler(request).then((result) => {
    t.ok(dynamoPutStub.calledOnce);
    const putCall = dynamoPutStub.getCall(0);
    t.equal(putCall.args[0].Item.userId, 'my-uuid');
    t.equal(putCall.args[0].Item.faceId, 'my-faceid');
    t.ok(result);
    t.end();
  });
});
