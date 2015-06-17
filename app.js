(function() {
  var PORT = process.env.PORT || 80;

  var Server = require('./server');
  var DatabaseManager = require('./lib/database-manager');

  var databaseManager = new DatabaseManager();
  var server = new Server();

  server.initialize()
  .then(function() {
    return server.connect(PORT);
  });
}());