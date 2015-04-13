/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

class AnalysisController {
  public static $inject: string[] = ['analysis'];

  constructor(private analysis) {
  }
}

angular.module('egrid')
  .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    $stateProvider
      .state('egrid.projects.get.analyses.get', {
        resolve: {
          analysis: ['$q', '$stateParams',
                     ($q: ng.IQService,
                      $stateParams: ng.ui.IStateParamsService) => {
            return $q.when(<any>egrid.model.Analysis.get($stateParams['projectKey'],
                                                         $stateParams['analysisKey']));
          }],
          grid: ['$q', '$stateParams',
                 ($q: ng.IQService,
                  $stateParams: ng.ui.IStateParamsService) => {
            return $q.when(<any>egrid.model.ProjectGrid.get($stateParams['projectKey'],
                                                            $stateParams['analysisKey']));
          }]
        },
        url: '/{analysisKey}',
        views: {
          'content@egrid': {
            controller: 'AnalysisController as analysis',
            templateUrl: '/partials/projects/get/analyses/get.html',
          },
        },
      })
  }])
  .controller('AnalysisController', AnalysisController);
