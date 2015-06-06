(function() {
  'use strict';

  var express = require('express');
  var morgan = require('morgan');

  var fileRouter = require('./routes/file');

  var app = express();

  app.use(morgan('combined'));

  // Add route for bower components
  app.use('/bower_components', express.static('bower_components'));
  // Add route for the app
  app.use(express.static('frontend'));

  // Add the file route
  app.use('/file', fileRouter);

  // Start the server listening
  app.listen(3000);

}());