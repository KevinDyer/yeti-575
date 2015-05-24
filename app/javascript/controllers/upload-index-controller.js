(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .controller('UploadIndexController', ['$http', '$scope', function($http, $scope) {
    var self = this;
    $scope.title = 'Uploads';
  }]);
})(angular);