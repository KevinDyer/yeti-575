(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .controller('AboutIndexController', ['$http', '$scope', function($http, $scope) {
    var self = this;

    // TODO Retrieve the author list from an end point
    $scope.authors = [
      {name: 'Adam Markham'},
      {name: 'Brett Brotherton'},
      {name: 'Kevin Dyer'},
    ];

  }]);
})(angular);