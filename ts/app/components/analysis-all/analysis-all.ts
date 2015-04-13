/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>

module egrid.app {
  class AnalysisAllController {
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.analyses.all', {
          abstract: true,
          url: '/all',
          views: {
            'tab-content@egrid.projects.get': {
              templateUrl: '/components/analysis-all/analysis-all.html',
            },
          },
        });
    }])
    .controller('AnalysisAllController', AnalysisAllController);
}
