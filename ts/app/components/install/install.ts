/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class InstallController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.install', {
          url: '/install',
          views: {
            'content@egrid': {
              controller: ['$scope', '$window', ($scope, $window) => {
                $scope.installApp = function() {
                  var request = $window.navigator.mozApps.install($window.location.origin + '/egrid.webapp');
                  request.onsuccess = function() {
                    console.log('success', this.result);
                  };
                  request.onerror = function() {
                    console.log('error', this.error);
                  };
                };
              }],
              templateUrl: '/components/install/install.html',
            },
          },
        })
    }])
    .controller('InstallController', InstallController);
}
