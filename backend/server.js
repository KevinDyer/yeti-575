(function() {
  'use strict';

  var express = require('express');
  var app = express();
  var dataRouter = require('./routes/data');

  app.use('/data', dataRouter);

  app.listen(3000);
}());