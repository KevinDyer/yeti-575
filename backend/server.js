(function() {
  'use strict';

  var express = require('express');
  var app = express();
  var dataRouter = require('./routes/data');

  // Add the data route
  app.use('/data', dataRouter);

  // Add route for bower components
  app.use('/bower_components', express.static('bower_components'));
  // Add route for the app
  app.use(express.static('frontend'));

  // Start the server listening
  app.listen(3000);
}());