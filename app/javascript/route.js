(function (angular) {
  'use strict';

  angular.module('Yeti575')
  .config(function($routeProvider) {
    $routeProvider.when('/data', {
      templateUrl: 'templates/pages/data/index.html',
      controller: 'DataIndexController',
      controllerAs: 'indexController'
    })
    .when('/about', {
      templateUrl: 'templates/pages/about/index.html',
      controller: 'AboutIndexController',
      controllerAs: 'indexController'
    })
    .when('/', {
      redirectTo: '/data',
    })
    .otherwise({redirectTo: '/'});
  });
})(angular);