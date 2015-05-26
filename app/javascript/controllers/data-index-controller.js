(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .controller('DataIndexController', ['$scope', 'Upload', function($scope, Upload) {
    var self = this;

    $scope.fileFilter = '';
    $scope.files = [];

    $scope.fileDropped = function($files, $event, $rejectedFiles) {
    };

    $scope.upload = function(files) {
      if (!files || !files.length) {
        return;
      }

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        Upload.upload({
          url: '/data/files',
          file: file,
          fieldname: 'file-' + i.toString()
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          $scope.files = [];
          console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        });
      }
    };
  }]);
})(angular);