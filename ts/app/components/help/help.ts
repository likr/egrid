/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class HelpController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.help', {
          url: '/help',
          views: {
            'content@egrid': {
              templateUrl: '/components/help/help.html',
            },
          },
        });
    }])
    .controller('HelpController', HelpController);
}
