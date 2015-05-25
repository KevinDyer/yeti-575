(function () {
  'use strict';

  module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
      yeti575: {
        options: {
        },
        dev: {
          options: {
            port: 8000
          }
        },
        dist: {
          options: {
            port: 80
          }
        }
      }
    });

    grunt.registerMultiTask('yeti575', 'Start the Yeti-575 server', function () {
      // Start this task asycn
      var done = this.async();

      var options = this.options();
      var port = options.port || 80;

      var app = require('./app');
      app.listen(port, function() {
        //done();
      });
    });
  };
}());
