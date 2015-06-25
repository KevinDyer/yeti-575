(function() {
  'use strict';

  var HOST = '127.0.0.1';
  var PORT = 27017;
  var DATABASE_NAME = 'yeti-575';

  var mongoose = require('mongoose');
  var Promise = require('promise');

  var DatabaseManager = function(options) {
    this.options = options || {};
  };

  DatabaseManager.prototype.connect = function() {
    var self = this;
    return new Promise(function(fulfill, reject) {
      var conn = mongoose.connection;
      conn.once('error', reject);
      conn.once('open', fulfill);
      mongoose.connect('mongodb://'+HOST+'/'+DATABASE_NAME);
    });
  };

  module.exports = DatabaseManager;
}());