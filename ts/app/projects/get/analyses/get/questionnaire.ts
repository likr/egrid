/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>

module egrid.app {
  export class SemProjectQuestionnaireEditController {
    public static $inject : string[] = ['$q', 'project', 'analysis', 'grid', 'questionnaire'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']);
      }],
      questionnaire: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return model.Questionnaire.get($stateParams['projectKey'], $stateParams['analysisKey']);
      }],
    };
    items;
    egm: any;
    grid: any;
    selection: D3.Selection

    constructor(
        private $q: ng.IQService,
        private project: model.Project,
        private analysis: model.Analysis,
        private gridData: model.ProjectGrid,
        private questionnaire: model.Questionnaire) {
      var width = $('#display-wrapper').width();
      var height = $('#display-wrapper').height();
      this.egm = egrid.core.egm()
        .vertexVisibility((item) => item.visible)
        .size([width, height]);
      this.grid = egrid.core.grid(gridData.nodes, gridData.links);
      var graph = this.grid.graph();

      var questionnaireItems = d3.set(questionnaire.items);

      this.items = graph.vertices().map((u) => {
        return graph.get(u);
      });
      this.items.sort((item1, item2) => {
        return item2.weight - item1.weight;
      });
      this.items.forEach((item) => {
        item.visible = questionnaireItems.has(item.text);
      });

      this.selection = d3.select('#display')
        .datum(graph)
        .call(this.egm.css())
        .call(this.egm)
        .call(this.egm.center());
    }

    updateItems() {
      d3.select('#display')
        .call(this.egm);
    }

    submit() {
      this.questionnaire.items = this.items.filter(d => d.visible).map(d => d.text);
      this.$q.when(this.questionnaire.save())
        .then(() => {
          console.log('ok');
        });
    }

    exportContent(): string {
      var content = this.items.filter(d => d.visible).map(d => unescape(encodeURIComponent(d.text))).join(',');
      return 'data:text/csv;charset=utf-8;base64,' + btoa(content);
    }
  }
}
