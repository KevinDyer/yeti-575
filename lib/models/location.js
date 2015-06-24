(function() {
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var locationSchema = new Schema({
    type:      {type: String, required: true},
    info:      {type: Schema.Types.Mixed, required: true},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: Date.now}
  });

  locationSchema.pre('update', function() {
    this.update({$set: {updatedAt: Date.now()}});
  });

  mongoose.model('Location', locationSchema);
}());