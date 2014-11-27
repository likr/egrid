/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/d3-downloadable.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>

module egrid.app {
  export class ParticipantGridController {
    public static $inject : string[] = ['$window', '$state', 'project', 'participant', 'gridData'];
    public static resolve = {
      gridData: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ParticipantGrid.get($stateParams['projectKey'], $stateParams['participantKey']));
      }]
    };
    grid: any;
    graph: any;
    updateGrid: any;

    constructor($window, private $state, public project, public participant, private gridData) {
      this.grid = egrid.core.grid(gridData.nodes, gridData.links);
      this.graph = this.grid.graph();

      var width = $('#display-wrapper').width();
      var height = 500;
      var egm = egrid.core.egm()
        .maxTextLength(10)
        .enableZoom(false)
        .size([width, height]);
      var downloadable = d3.downloadable({
        filename: this.project.name + ' - ' + this.participant.name,
        width: width,
        height: height
      });

      var selection = d3.select('#display')
        .datum(this.graph)
        .call(egm)
        .call(egm.center())
        .call(downloadable);

      $window.onresize = () => {
        var width = $('#display-wrapper').width();
        var height = 500;
        downloadable
          .width(width)
          .height(height);
        selection
          .call(egm.resize(width, height));
      };

      this.updateGrid = (grid) => {
        this.gridData.nodes = grid.nodes;
        this.gridData.links = grid.links;
        this.gridData.update()
          .then(() => {
            this.$state.go('egrid.projects.get.participants.get.grid', null, {reload: true});
          });
      }
    }

    numConstructs(): number {
      return this.graph.numVertices();
    }

    numLinks(): number {
      return this.graph.numEdges();
    }
  }
}
