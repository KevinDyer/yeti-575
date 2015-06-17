(function() {
  'use strict';

  var HOST = '127.0.0.1';
  var PORT = 27017;
  var DATABASE_NAME = 'test';

  var mongoose = require('mongoose');

  var DatabaseManager = function(options) {
    this.options = options || {};
  };

  DatabaseManager.prototype.initialize = function() {
    return this._connect();
  };

  DatabaseManager.prototype._connect = function() {
    var self = this;
    return new Promise(function(fulfill, reject) {
      self.db = mongoose.createConnection();
      self.once('error', reject);
      self.db.open(HOST, DATABASE_NAME, PORT, self.options, function() {
        fulfill(self);
      });
    });
  };

  module.exports = DatabaseManager;
}());