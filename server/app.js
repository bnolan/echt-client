const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

// Handlers
const hello = require('./hello');
const newsfeed = require('./newsfeed');

api.get('/hello', hello.handler);
api.get('/newsfeed', newsfeed.handler);

module.exports = api;
