(function() {
  'use strict';

  var express = require('express');
  var app = express();

  app.use('/bower_components', express.static('bower_components'));

  app.use(express.static('app'));

  app.listen(8000, function() {
    console.log('Listening on *8000');
  });
}());