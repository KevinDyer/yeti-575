(function() {
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var identifierSchema = new Schema({
    type:      {type: String, required: true},
    info:      {type: Schema.Types.Mixed, required: true},
    createdAt: {type: Number, default: Date.now}
  });

  mongoose.model('Identifier', identifierSchema);
}());