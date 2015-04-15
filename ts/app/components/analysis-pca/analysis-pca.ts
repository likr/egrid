/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../../typings/egrid-core/egrid-core.d.ts"/>
/// <reference path="../../../../typings/d3-downloadable/d3-downloadable.d.ts"/>
/// <reference path="../../../../typings/d3-pca/d3-pca.d.ts"/>

class AnalysisPcaController {
  public static $inject: string[] = [
    '$http',
    '$sce',
    'showMessageDialog',
    'waiting',
    'questionnaire'
  ];
  private sheetUrl: string;

  constructor(
      private $http,
      private $sce,
      private showMessageDialog,
      private waiting,
      questionnaire) {
    this.sheetUrl = questionnaire.sheetUrl;
  }

  openSpreadsheet() {
    this.waiting(true);
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
        this.waiting(false);
      })
      .error(() => {
        var message = '<a href="' + url + '" target="_blank">Authorize from this link</a>';
        this.showMessageDialog(this.$sce.trustAsHtml(message));
        this.waiting(false);
      });
  }
}

angular.module('egrid')
  // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
  //   $stateProvider
  //     .state('egrid.projects.get.analyses.get.pca', {
  //       resolve: {
  //         questionnaire: ['$q', '$stateParams',
  //                         ($q: ng.IQService,
  //                          $stateParams: ng.ui.IStateParamsService) => {
  //           return $q.when(<any>egrid.model.Questionnaire.get($stateParams['projectKey'],
  //                                                             $stateParams['analysisKey']));
  //         }],
  //       },
  //       url: '/pca',
  //       views: {
  //         'tab-content@egrid.projects.get.analyses.get': {
  //           controller: 'AnalysisPcaController as analysisPca',
  //           templateUrl: '/components/analysis-pca/analysis-pca.html',
  //         }
  //       }
  //     });
  // }])
  .controller('AnalysisPcaController', AnalysisPcaController);
