(function() {
  var PORT = process.env.PORT || 80;

  var DatabaseManager = require('./lib/database-manager');
  var databaseManager = new DatabaseManager();
  databaseManager.connect()
  .then(function() {
    require('./lib/models/location');
    require('./lib/models/identifier');
    require('./lib/models/event');
  })
  .then(function() {
    var Server = require('./server');
    var server = new Server();
    return server.connect(PORT);
  })
  .then(null, function(err) {
    console.log(err);
  });
}())