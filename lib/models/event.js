(function() {
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var eventSchema = new Schema({
    type:       {type: String, required: true},
    info:       {type: Schema.Types.Mixed, required: true},
    location:   {type: Schema.Types.ObjectId, required: true, ref: 'Location'},
    identifier: {type: Schema.Types.ObjectId, required: true, ref: 'Indentifier'},
    createdAt:  {type: Number, default: Date.now},
    updatedAt:  {type: Number, default: Date.now}
  });

  eventSchema.pre('update', function() {
    this.update({$set: {updatedAt: Date.now()}});
  });

  mongoose.model('Event', eventSchema);
}());