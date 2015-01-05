/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../lib/d3-downloadable.d.ts"/>
/// <reference path="../../../lib/d3-pca.d.ts"/>
/// <reference path="../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../lib/egrid-core.d.ts"/>

class AnalysisPcaController {
  public static $inject: string[] = [
    '$http',
    'questionnaire'
  ];
  private sheetUrl: string;

  constructor(
      private $http,
      questionnaire) {
    this.sheetUrl = questionnaire.sheetUrl;
  }

  openSpreadsheet() {
    var url = 'https://script.google.com/macros/s/AKfycbz3lF61Cylnn_2UCUouO6wqh_Fmtv0M5WODnY7Mmf27jfmKSEVX/exec';
    this.$http
      .jsonp(url, {
        params: {
          callback: 'JSON_CALLBACK',
          url: this.sheetUrl
        }
      })
      .success(data => {
        var pca = d3.pca();
        d3.select('#display')
          .datum(data.items.map(d => {
            return {
              name: '',
              values: d
            };
          }))
          .call(pca)
          .call(d3.downloadable({
            filename: 'pca',
            width: 1000,
            height: 800
          }));
      })
      .error(() => {
        console.log(arguments);
      });
  }
}

angular.module('egrid')
  .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    $stateProvider
      .state('egrid.projects.get.analyses.get.pca', {
        resolve: {
          questionnaire: ['$q', '$stateParams',
                          ($q: ng.IQService,
                           $stateParams: ng.ui.IStateParamsService) => {
            return $q.when(egrid.model.Questionnaire.get($stateParams['projectKey'],
                                                         $stateParams['analysisKey']));
          }],
        },
        url: '/pca',
        views: {
          'tab-content@egrid.projects.get.analyses.get': {
            controller: 'AnalysisPcaController as pca',
            templateUrl: '/partials/projects/get/analyses/get/pca.html',
          }
        }
      });
  }])
  .controller('AnalysisPcaController', AnalysisPcaController);
