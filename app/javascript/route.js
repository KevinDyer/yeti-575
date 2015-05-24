(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .config(function($routeProvider) {
    $routeProvider.when('/upload', {
      templateUrl: 'templates/pages/upload/index.html',
      controller: 'UploadIndexController',
      controllerAs: 'indexController'
    })
    .when('/', {
      redirectTo: '/upload',
    })
    .otherwise({redirectTo: '/'});
  });
})(angular);