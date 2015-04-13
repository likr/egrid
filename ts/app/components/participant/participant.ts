/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class ParticipantController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants', {
          abstract: true,
          url: '/participants',
        });
    }])
    .controller('ParticipantController', ParticipantController);
}
