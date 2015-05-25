(function() {
  'use strict';

  var util = require('util');

  var express = require('express');
  var promise = require('promise');

  var dataRoute = require('./routes/data.js');

  var app = express();

  // Serve the app directory
  app.use(express.static('app'));
  // Serve the bower dependencies directory
  app.use('/bower_components', express.static('bower_components'));

  // Add the data route
  app.route('/data', dataRoute);

  module.exports = app;
}());