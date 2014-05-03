/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../controller-base.ts"/>

module egrid.app {
  export class ParticipantGridController extends ControllerBase {
    public static $inject : string[] = ['$window', '$rootScope', '$state', '$scope', '$timeout', '$filter', 'alertLifeSpan', 'grid'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ParticipantGrid.get($stateParams['projectKey'], $stateParams['participantKey']));
      }]
    };
    egm : EGM;

    constructor($window, $rootScope, $state, $scope, $timeout, $filter, alertLifeSpan, grid) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.egm = new EGM;
      var nodes = grid.nodes.map(d => new egrid.Node(d.text, d.weight, d.original));
      var links = grid.links.map(d => new egrid.Link(nodes[d.source], nodes[d.target], d.weight));
      this.egm
        .nodes(nodes)
        .links(links)
        ;
      this.draw();
    }

    draw() {
      d3.select("#display")
        .call(this.egm.display($("#display").width(), $("#display").height()))
        ;
      this.egm
        .draw()
        .focusCenter()
    }
  }
}
