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
    public items;
    public egm: EGM;

    constructor(
        private $q: ng.IQService,
        private project: model.Project,
        private analysis: model.Analysis,
        private grid: model.ProjectGrid,
        private questionnaire: model.Questionnaire) {
      this.egm = new EGM;
      var options = new EgmOption;
      options.scaleType = ScaleType.None;
      this.egm.options(options);

      var width = $("#sem-questionnaire-deisgn-display").width();
      var height = $("#sem-questionnaire-deisgn-display").height();
      d3.select("#sem-questionnaire-design-display svg")
        .call(this.egm.display(width, height))
        ;
      var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original, d.participants));
      var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
      var questionnaireDict = {};
      questionnaire.items.forEach(item => {
        questionnaireDict[item] = item;
      });
      nodes.forEach(node => {
        if (questionnaireDict[node.text] === undefined) {
          node.visible = false;
        }
      });
      this.items = nodes;
      this.items.sort((item1, item2) => item2.weight - item1.weight);
      this.egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    }

    updateItems() {
      this.egm
        .draw()
        .focusCenter()
        ;
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
