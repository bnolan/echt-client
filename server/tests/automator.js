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
    let headersWithDefaults = Object.assign({'content-type': 'application/json'}, headers);
    app.proxyRouter({
      requestContext: {
        resourcePath: path,
        httpMethod: 'PUT'
      },
      headers: headersWithDefaults,
      body: JSON.stringify(jsonBody)
    }, {
      done: function (something, response) {
        callback(JSON.parse(response.body));
      }
    });
  }

  post (path, jsonBody, headers, callback) {
    let headersWithDefaults = Object.assign({'content-type': 'application/json'}, headers);
    app.proxyRouter({
      requestContext: {
        resourcePath: path,
        httpMethod: 'POST'
      },
      headers: headersWithDefaults,
      body: jsonBody
    }, {
      done: function (something, response) {
        callback(JSON.parse(response.body));
      }
    });
  }
};
