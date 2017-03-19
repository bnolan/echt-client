const proxyquire = require('proxyquire');
const test = require('tape');
const sinon = require('sinon');

const configStub = {
  update: sinon.stub()
};

const dynamoPutStub = sinon.stub().returns({
  promise: () => Promise.resolve({
    Attributes: {}
  })
});

const dynamoStub = {
  DocumentClient: function DocumentClient () {
    this.put = dynamoPutStub;
  }
};

const awsStub = {
  config: configStub,
  DynamoDB: dynamoStub
};

const signUp = proxyquire('../handlers/sign-up', {
  'aws-sdk': awsStub
});

function getRequest() {
  return {
    body: {
      name: 'my-name'
    },
    headers: {
      deviceId: 'my-device-id'
    }
  };
}

test('creates user with unique key', function (t) {
  const request = getRequest();
  let results = [];
  Promise.all([
    signUp.handler(request).then((result) => results.push(result)),
    signUp.handler(request).then((result) => results.push(result))
  ]).then(() => {
    t.doesNotEqual(results[0].user.uuid, results[1].user.uuid);
    t.end();
  })

});
