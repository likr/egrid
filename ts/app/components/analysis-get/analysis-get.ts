/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

class AnalysisGetController {
  public static $inject: string[] = ['analysis'];

  constructor(private analysis) {
  }
}

angular.module('egrid')
  // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
  //   $stateProvider
  //     .state('egrid.projects.get.analyses.get', {
  //       resolve: {
  //         analysis: ['$stateParams', ($stateParams: ng.ui.IStateParamsService) => {
  //           return egrid.model.Analysis.get($stateParams['projectKey'], $stateParams['analysisKey']);
  //         }],
  //         grid: ['$stateParams', ($stateParams: ng.ui.IStateParamsService) => {
  //           return egrid.model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']);
  //         }]
  //       },
  //       url: '/{analysisKey}',
  //       views: {
  //         'content@egrid': {
  //           controller: 'AnalysisGetController as analysisGet',
  //           templateUrl: '/components/analysis-get/analysis-get.html',
  //         },
  //       },
  //     })
  // }])
  .controller('AnalysisGetController', AnalysisGetController);
