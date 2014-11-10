/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/d3-downloadable.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>

module egrid.app {
  export class ProjectGridController {
    public static $inject : string[] = ['$window', '$state', 'project', 'grid'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']));
      }]
    };
    grid: any;
    graph: any;
    vertices: number[];
    respondentsKey: (u: number) => number;
    degreeKey: (u: number) => number;

    constructor(
        $window,
        $state,
        private project,
        grid) {

      this.grid = egrid.core.grid(grid.nodes, grid.links);
      this.graph = this.grid.graph();
      var width = $('#display-wrapper').width();
      var height = 500;
      var egm = egrid.core.egm()
        .maxTextLength(10)
        .enableZoom(false)
        .size([width, height]);
      var downloadable = d3.downloadable({
        filename: this.project.name,
        width: width,
        height: height
      });

      var selection = d3.select('#display')
        .datum(this.graph)
        .call(egm)
        .call(egm.center())
        .call(downloadable);

      this.vertices = this.graph.vertices();

      this.respondentsKey = (u) => {
        return this.graph.get(u).participants.length;
      };

      this.degreeKey = (u) => {
        return this.graph.inDegree(u) + this.graph.outDegree(u);
      };

      $window.onresize = function() {
        var width = $('#display-wrapper').width();
        var height = 500;
        downloadable
          .width(width)
          .height(height);
        selection.call(egm.resize(width, height));
      };
    }

    numConstructs(): number {
      return this.graph.numVertices();
    }

    numLinks(): number {
      return this.graph.numEdges();
    }
  }
}
