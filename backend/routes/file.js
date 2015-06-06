(function () {
  'use strict';

  var express = require('express');
  var multer = require('multer');
  var Router = express.Router;

  var router = new Router();

  router.route('/')
  .get(function(req, res) {
    // TODO Read the uploads directory for files
  })
  .post(multer({dest: './uploads/'}), function(req, res) {
    res.sendStatus(204);
  });

  module.exports = router;
}());