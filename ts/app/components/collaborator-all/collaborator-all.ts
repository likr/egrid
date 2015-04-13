/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class CollaboratorAllController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.collaborators.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/components/collaborator-all/collaborator-all.html',
            },
          },
        });
    }])
    .controller('CollaboratorAllController', CollaboratorAllController);
}
