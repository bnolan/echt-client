const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

// Handlers
const initializeSignUp = require('./handlers/initialize-sign-up');
const signUp = require('./handlers/sign-up');
const newsfeed = require('./handlers/newsfeed');
const uploadPhoto = require('./handlers/upload-photo');

api.get('/sign-up', initializeSignUp.handler);
api.post('/sign-up', signUp.handler);

api.get('/photos', newsfeed.handler);
api.post('/photos', uploadPhoto.handler);

module.exports = api;
