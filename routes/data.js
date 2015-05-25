(function () {
  'use strict';

  var Router = require('express').Router;
  var router = new Router();

  var dataFiles = [];

  // Add the data file uplaod route
  router.route('/files')
  .get(function(request, response) {
    response.json(dataFiles);
  })
  .post(function(request, response) {
    // TODO Add data file
  });

  module.exports = router;
}());