const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

// Handlers
const hello = require('./handlers/hello');
const timeline = require('./handlers/timeline');
const uploadPhoto = require('./handlers/upload-photo');

api.get('/hello', hello.handler);
api.get('/photos', timeline.handler);
api.put('/photos', uploadPhoto.handler);

module.exports = api;
