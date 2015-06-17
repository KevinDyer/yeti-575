(function() {
  'use strict';

  var http = require('http');
  var express = require('express');
  var morgan = require('morgan');
  var fileRouter = require('./routes/file');

  var Server = function() {
    this.app = express();
    this.app.use(morgan('tiny'));

    // Add route for bower components
    this.app.use('/bower_components', express.static('bower_components'));
    // Add route for the app
    this.app.use(express.static('frontend'));

    // Add the file route
    this.app.use('/file', fileRouter);
  };

  Server.prototype.initialize = function() {
    return Promise.resolve(this);
  };

  Server.prototype.connect = function(port) {
    var self = this;
    return new Promise(function(fulfill, reject) {
      var server = http.createServer(self.app);
      server.on('error', reject);
      server.listen(port, function() {
        fulfill(server);
      });
    });
  };

  module.exports = Server;
}());