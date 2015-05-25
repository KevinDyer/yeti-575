(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .config(function($routeProvider) {
    $routeProvider.when('/upload', {
      templateUrl: 'templates/pages/upload/index.html',
      controller: 'UploadIndexController',
      controllerAs: 'indexController'
    })
    .when('/about', {
      templateUrl: 'templates/pages/about/index.html',
      controller: 'AboutIndexController',
      controllerAs: 'indexController'
    })
    .when('/', {
      redirectTo: '/upload',
    })
    .otherwise({redirectTo: '/'});
  });
})(angular);