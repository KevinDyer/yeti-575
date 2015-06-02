(function() {
  'use strict';

  var expect = require('chai').expect;
  var request = require('request');

  describe('Yeti 575 Backend API', function() {

    describe('Data Router', function() {
      var url = 'http://localhost:3000/data';

      it('returns status 200', function(done) {
        request(url, function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          console.log(response);
          done();
        });
      });
    });
  });
}());