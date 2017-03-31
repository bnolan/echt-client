'use strict';

const app = require('../../app');

class Automator {
  get (path, queryString, headers, callback) {
    app.proxyRouter({
      requestContext: {
        resourcePath: path,
        httpMethod: 'GET'
      },
      queryStringParameters: queryString,
      headers: headers
    }, {
      done: function (err, response) {
        if (err) {
          throw new Error(err);
        }

        callback(JSON.parse(response.body));
      }
    });
  }

  put (path, jsonBody, headers, callback) {
    let headersWithDefaults = Object.assign({'content-type': 'application/json'}, headers);
    console.log('#put', arguments);
    app.proxyRouter({
      requestContext: {
        resourcePath: path,
        httpMethod: 'PUT'
      },
      headers: headersWithDefaults,
      body: JSON.stringify(jsonBody)
    }, {
      done: function (err, response) {
        if (err) {
          throw new Error(err);
        }

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
      done: function (err, response) {
        if (err) {
          throw new Error(err);
        }

        callback(JSON.parse(response.body));
      }
    });
  }
}

module.exports = Automator;
