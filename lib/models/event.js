(function() {
  'use strict';

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  var eventSchema = new Schema({
    type:       {type: String, required: true},
    info:       {type: Schema.Types.Mixed, required: true},
    location:   {type: Schema.Types.ObjectId, required: true, ref: 'Location'},
    identifier: {type: Schema.Types.ObjectId, required: true, ref: 'Indentifier'},
    timestamp:  {type: Number, required: true}
  });

  mongoose.model('Event', eventSchema);
}());