/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../controller-base.ts"/>

module egrid.app {
  export class ProjectGridController extends ControllerBase {
    public static $inject : string[] = ['$window', '$rootScope', '$state', '$scope', '$timeout', '$filter', 'alertLifeSpan', 'grid'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']));
      }]
    };
    grid: any;
    vertices: number[];
    respondentsKey: (u: number) => number;
    degreeKey: (u: number) => number;

    constructor($window, $rootScope, $state, $scope, $timeout, $filter, alertLifeSpan, grid) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.grid = egrid.core.grid(grid.nodes, grid.links);
      var egm = egrid.core.egm()
        .maxTextLength(10)
        .enableZoom(false)
        .size([$('#display-wrapper').width(), 500]);

      d3.select('#display')
        .datum(this.grid.graph())
        .call(egm.css())
        .call(egm)
        .call(egm.center());

      this.vertices = this.grid.graph().vertices();

      this.respondentsKey = (u) => {
        return this.grid.graph().get(u).participants.length;
      };

      this.degreeKey = (u) => {
        var graph = this.grid.graph();
        return graph.inDegree(u) + graph.outDegree(u);
      };
    }

    numConstructs(): number {
      return this.grid.graph().numVertices();
    }

    numLinks(): number {
      return this.grid.graph().numEdges();
    }
  }
}
