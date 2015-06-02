(function() {
  'use strict';

  var expect = require('chai').expect;
  var Analyzer = require('../backend/lib/analyzer');

  var rowOne = {addrHash: 'One', epoch: 1, snr: -1};
  var rowTwo = {addrHash: 'Two', epoch: 2, snr: -2};

  describe('Data File Analyzer', function() {
    describe('Constructor', function() {
      it('finds unique records', function() {
        var rows = [rowOne, rowOne];
        var analyzer = new Analyzer(rows);

        expect(analyzer.getData().length).to.equal(1);
      });

      it('save all raw records', function() {
        var rows = [rowOne, rowOne];
        var analyzer = new Analyzer(rows);

        expect(analyzer.getData()[0].rawData.length).to.equal(2);
      });

      it('should remember the first appearance', function() {
        var rows = [rowOne, {addrHash: rowOne.addrHash, epoch: (rowOne.epoch-1), snr: rowOne.snr}];
        var analyzer = new Analyzer(rows);

        var first = analyzer.getData()[0].first;
        expect(first).to.equal(rowOne.epoch-1);
      });

      it('should remember the last appearance', function() {
        var rows = [rowOne, {addrHash: rowOne.addrHash, epoch: (rowOne.epoch+1), snr: rowOne.snr}];
        var analyzer = new Analyzer(rows);

        var last = analyzer.getData()[0].last;
        expect(last).to.equal(rowOne.epoch+1);
      });
        
    });

    describe('getData', function() {
      it('should return all unique rows as records', function() {
        var rows = [rowOne, rowTwo];
        var analyzer = new Analyzer(rows);

        expect(analyzer.getData().length).to.equal(2);
      });
    });
  });

}());