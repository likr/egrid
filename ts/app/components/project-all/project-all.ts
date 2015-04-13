/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class ProjectAllController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.all', {
          abstract: true,
          url: '/all',
          views: {
            'content@egrid': {
              templateUrl: '/partials/projects/all.html',
            },
          },
        });
    }])
    .controller('ProjectAllController', ProjectAllController);
}
