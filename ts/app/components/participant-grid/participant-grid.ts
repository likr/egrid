/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../typings/d3-downloadable/d3-downloadable.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../../typings/egrid-core/egrid-core.d.ts"/>

module egrid.app {
  class ParticipantGridController {
    public static $inject : string[] = ['$window', '$state', 'project', 'participant', 'gridData'];
    public static resolve = {
      gridData: ['$stateParams', ($stateParams: ng.ui.IStateParamsService) => {
        return model.ParticipantGrid.get($stateParams['projectKey'], $stateParams['participantKey']);
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

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants.get.grid', {
          resolve: ParticipantGridController.resolve,
          url: '/grid',
          views: {
            'tab-content@egrid.projects.get.participants.get': {
              controller: 'ParticipantGridController as participantGrid',
              templateUrl: '/components/participant-grid/participant-grid.html',
            },
          },
        });
    }])
    .controller('ParticipantGridController', ParticipantGridController);
}
