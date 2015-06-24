(function() {
  'use strict';
  var path = require('path');

  var express = require('express');
  var multer = require('multer');
  var Router = express.Router;

  var UPLOAD_DIR = path.resolve('./uploads');

  var router = new Router();

  router.route('/')
  .post(multer({dest: UPLOAD_DIR}), function(req, res) {
  });

  module.exports = router;
}());