/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class AnalysisListController {
    public static $inject : string[] = ['grids'];
    public static resolve = {
      grids: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(<any>model.Analysis.query($stateParams['projectKey']));
      }],
    };

    constructor(private list) {
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.analyses.all.list', {
          resolve: AnalysisListController.resolve,
          url: '/list',
          views: {
            'sub-tab-content@egrid.projects.get.analyses.all': {
              controller: 'AnalysisListController as analysisList',
              templateUrl: '/components/analysis-list/analysis-list.html',
            },
          },
        });
    }])
    .controller('AnalysisListController', AnalysisListController);
}
