/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

module egrid.app {
  class CollaboratorController {
  }

  angular.module('egrid')
    // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    //   $stateProvider
    //     .state('egrid.projects.get.collaborators', {
    //       abstract: true,
    //       url: '/collaborators',
    //     });
    // }])
    .controller('CollaboratorController', CollaboratorController);
}
