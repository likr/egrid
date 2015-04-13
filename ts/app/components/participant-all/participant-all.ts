/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class ParticipantAllController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/components/participant-all/participant-all.html',
            },
          },
        });
    }])
    .controller('ParticipantAllController', ParticipantAllController);
}
