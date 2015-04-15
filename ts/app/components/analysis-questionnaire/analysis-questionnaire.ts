/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../../typings/egrid-core/egrid-core.d.ts"/>

module egrid.app {
  class AnalysisQuestionnaireController {
    public static $inject : string[] = [
      '$q',
      '$http',
      '$sce',
      'showConfirmDialog',
      'showMessageDialog',
      'waiting',
      'project',
      'analysis',
      'grid',
      'questionnaire'
    ];
    // public static resolve = {
    //   grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
    //     return model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']);
    //   }],
    //   questionnaire: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
    //     return model.Questionnaire.get($stateParams['projectKey'], $stateParams['analysisKey']);
    //   }],
    // };
    items: any[];
    egm: any;
    grid: any;
    selection: D3.Selection;
    formUrl: string;

    constructor(
        private $q: ng.IQService,
        private $http: ng.IHttpService,
        private $sce: ng.ISCEService,
        private showConfirmDialog: any,
        private showMessageDialog,
        private waiting,
        private project: model.Project,
        private analysis: model.Analysis,
        private gridData: model.ProjectGrid,
        private questionnaire: model.Questionnaire) {
      this.formUrl = this.questionnaire.formUrl;
      this.grid = egrid.core.grid(gridData.nodes, gridData.links);
      var graph = this.grid.graph();
      this.items = graph.vertices().map((u) => {
        return graph.get(u);
      });
      this.items.sort((item1, item2) => {
        return item2.participants.length - item1.participants.length;
      });
      this.items.forEach((item) => {
        item.visible = true;
      });
    }

    drawGrid() {
      var width = $('#display-wrapper').width();
      var height = $('#display-wrapper').height();
      this.egm = egrid.core.egm()
        .vertexVisibility((item: any) => item.visible)
        .size([width, height]);
      this.selection = d3.select('#display')
        .datum(this.grid.graph())
        .call(this.egm)
        .call(this.egm.center());
    }

    updateItems() {
      d3.select('#display')
        .call(this.egm);
    }

    createQuestionnaire() {
      this.waiting(true);
      var url = 'https://script.google.com/macros/s/AKfycbyle0FkPUdzJx4uLEpHRe3fuVZmPT6uhkRPfY-3DplX75hCWRA/exec';
      this.$http
        .jsonp(url, {
          params: {
            callback: 'JSON_CALLBACK',
            title: this.analysis.name,
            items: this.items.filter(item => item.visible).map(item => item.text)
          }
        })
        .success((data: any) => {
          this.questionnaire.formUrl = data.formUrl;
          this.questionnaire.sheetUrl = data.sheetUrl;
          this.$q.when(<any>this.questionnaire.save())
            .then(() => {
              this.formUrl = data.formUrl;
            });
          this.waiting(false);
        })
        .error(() => {
          var message = '<a href="' + url + '" target="_blank">Authorize from this link</a>';
          this.showMessageDialog(this.$sce.trustAsHtml(message));
          this.waiting(false);
        })
    }

    resetQuestionnaire() {
      this.showConfirmDialog('MESSAGES.CONFIRM_REMOVE')
        .result
        .then(() => {
          this.questionnaire.formUrl = null;
          this.$q.when(<any>this.questionnaire.save())
            .then(() => {
              this.formUrl = null;
            });
        });
    }
  }

  angular.module('egrid')
    // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    //   $stateProvider
    //     .state('egrid.projects.get.analyses.get.questionnaire', {
    //       resolve: AnalysisQuestionnaireController.resolve,
    //       url: '/questionnaire',
    //       views: {
    //         'tab-content@egrid.projects.get.analyses.get': {
    //           controller: 'AnalysisQuestionnaireController as analysisQuestionnaire',
    //           templateUrl: '/components/analysis-questionnaire/analysis-questionnaire.html',
    //         },
    //       },
    //     });
    // }])
    .controller('AnalysisQuestionnaireController', AnalysisQuestionnaireController);
}
