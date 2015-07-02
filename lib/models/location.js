(function() {
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var locationSchema = new Schema({
    type: {type: String, required: true},
    name: {type: String, required: true},
    info: {type: Schema.Types.Mixed},
  });

  mongoose.model('Location', locationSchema);
}());