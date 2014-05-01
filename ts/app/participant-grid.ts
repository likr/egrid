/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../lib/egrid-core.d.ts"/>
/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>

module egrid.app {
  export class ParticipantGridController extends ControllerBase {
    private static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$scope', '$timeout', '$filter', 'alertLifeSpan'];
    projectKey : string;
    participantKey : string;
    egm : EGM;

    constructor($window, $q, $rootScope, $stateParams, $state, $scope, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams.projectId;
      this.participantKey = $stateParams.participantId;
      this.egm = new EGM;

      $q.when(model.ParticipantGrid.get(this.projectKey, this.participantKey))
        .then((grid : model.ParticipantGrid) => {
          var nodes = grid.nodes.map(d => new egrid.Node(d.text, d.weight, d.original));
          var links = grid.links.map(d => new egrid.Link(nodes[d.source], nodes[d.target], d.weight));
          this.egm
            .nodes(nodes)
            .links(links)
            ;
          this.draw();
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reasons[0]['status'] === 404 || reasons[0]['status'] === 500) {
            // プロジェクトが存在しない可能性もある…がそれは遷移先でやる
            $state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;
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
