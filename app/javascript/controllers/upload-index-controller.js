(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .controller('UploadIndexController', ['$http', '$scope', function($http, $scope) {
    var self = this;
    $scope.title = 'Uploads';

    $scope.uploadFile = function() {
      $http({method: 'POST', url: '/uploads', data: {hello: 'world'}})
      .success(function(data, status) {
        console.log(status);
      });
    };
  }]);
})(angular);