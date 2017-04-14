const getStage = require('./get-stage');

module.exports = function addErrorReporter (request) {
  const stage = getStage(request.lambdaContext);

  if (stage !== 'uat') {
    console.log('not uat');
    return;
  }

  if (!request.lambdaContext.awsRequestId) {
    console.log('not aws request id');
    return;
  }

  const raygun = require('raygun');
  const raygunClient = new raygun.Client().init({ apiKey: 't4ZsXM91R2CW+V5SfmxcrA==' });

  process.on('uncaughtException', function (err) {
    raygunClient.send(err);
  });

  // Not sure if this is the right way to do it
  process.on('unhandledRejection', (reason, p) => {
    try {
      // the synchronous code that we want to catch thrown errors on
      var err = new Error(`Possibly Unhandled Rejection at.\n\nPromise ${p}\n\nReason ${reason}`);
      throw err;
    } catch (err) {
      raygunClient.send(err);
    }
  });
};
