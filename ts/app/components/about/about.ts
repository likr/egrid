/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class AboutController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.about', {
          url: '/about',
          views: {
            'content@egrid': {
              templateUrl: '/partials/about.html',
            },
          },
        });
    }])
    .controller('AboutController', AboutController);
}
