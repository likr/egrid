/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../typings/d3-downloadable/d3-downloadable.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../../typings/egrid-core/egrid-core.d.ts"/>

module egrid.app {
  class AnalysisGridController {
    public static $inject : string[] = ['$window', '$state', 'project', 'grid'];
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

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.analyses.get.grid', {
          url: '/grid',
          views: {
            'tab-content@egrid.projects.get.analyses.get': {
              controller: 'AnalysisGridController as analysisGrid',
              templateUrl: '/components/analysis-grid/analysis-grid.html',
            },
          },
        });
    }])
    .controller('AnalysisGridController', AnalysisGridController)
}
