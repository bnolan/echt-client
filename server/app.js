const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

// Handlers
const initializeSignUp = require('./handlers/initialize-sign-up');
const signUp = require('./handlers/sign-up');
const hello = require('./handlers/hello');
const timeline = require('./handlers/timeline');
const uploadPhoto = require('./handlers/upload-photo');

api.get('/sign-up', initializeSignUp.handler);
api.post('/sign-up', signUp.handler);

api.get('/hello', hello.handler);
api.get('/photos', timeline.handler);
api.post('/photos', uploadPhoto.handler);

module.exports = api;
