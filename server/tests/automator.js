const app = require('../app');

module.exports = class Automator {
  get (path, queryString, headers, callback) {
    app.proxyRouter({
      requestContext: {
        resourcePath: path,
        httpMethod: 'GET'
      },
      queryStringParameters: queryString,
      headers: headers
    }, {
      done: function (something, response) {
        callback(JSON.parse(response.body));
      }
    });
  }

  put (path, jsonBody, headers, callback) {
    throw new Error('not implemented');
  }

  post () {
    throw new Error('not implemented');
  }
};
