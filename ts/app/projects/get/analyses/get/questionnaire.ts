/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>

module egrid.app {
  export class SemProjectQuestionnaireEditController {
    public static $inject : string[] = ['$q', '$http', 'showConfirmDialog', 'project', 'analysis', 'grid', 'questionnaire'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']);
      }],
      questionnaire: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return model.Questionnaire.get($stateParams['projectKey'], $stateParams['analysisKey']);
      }],
    };
    items: any[];
    egm: any;
    grid: any;
    selection: D3.Selection;
    formUrl: string;

    constructor(
        private $q: ng.IQService,
        private $http: ng.IHttpService,
        private showConfirmDialog: any,
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
        .vertexVisibility((item) => item.visible)
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
      var url = 'https://script.google.com/macros/s/AKfycbyle0FkPUdzJx4uLEpHRe3fuVZmPT6uhkRPfY-3DplX75hCWRA/exec';
      this.$http
        .jsonp(url, {
          params: {
            callback: 'JSON_CALLBACK',
            title: this.analysis.name,
            items: this.items.map(item => item.text)
          }
        })
        .success((data) => {
          this.questionnaire.formUrl = data.formUrl;
          this.questionnaire.sheetUrl = data.sheetUrl;
          this.$q.when(this.questionnaire.save())
            .then(() => {
              this.formUrl = data.formUrl;
            });
        })
        .error(() => {
          console.log(arguments);
        })
    }

    resetQuestionnaire() {
      this.showConfirmDialog('MESSAGES.CONFIRM_REMOVE')
        .result
        .then(() => {
          this.questionnaire.formUrl = null;
          this.$q.when(this.questionnaire.save())
            .then(() => {
              this.formUrl = null;
            });
        });
    }
  }
}
