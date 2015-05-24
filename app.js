(function() {
  'use strict';

  var express = require('express');
  var app = express();

  // Serve the dependencies
  app.use('/bower_components', express.static('bower_components'));

  // Serve the app directory
  app.use(express.static('app'));

  app.post('/uploads', function(request, response) {
    response.sendStatus(201);
  });

  app.listen(8000, function() {
    console.log('Listening on *8000');
  });
}());