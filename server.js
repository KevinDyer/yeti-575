(function() {
  'use strict';

  var http = require('http');
  var express = require('express');
  var morgan = require('morgan');
  var Promise = require('promise');
  var fileRouter = require('./routes/file');
  var locationRouter = require('./routes/location');

  var Server = function() {
    this.app = express();

    // Add logging middleware
    this.app.use(morgan('short'));

    // Add route for bower components
    this.app.use('/bower_components', express.static('bower_components'));
    // Add route for the app
    this.app.use(express.static('frontend'));

    // Add the file route
    this.app.use('/file', fileRouter);
    this.app.use('/location', locationRouter);
  };

  Server.prototype.connect = function(port) {
    var self = this;
    return new Promise(function(fulfill, reject) {
      var server = http.createServer(self.app);
      server.once('error', reject);
      server.listen(port, function() {
        fulfill(server);
      });
    });
  };

  module.exports = Server;
}());