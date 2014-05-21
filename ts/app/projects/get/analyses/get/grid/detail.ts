/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/core/lib.extend.d.ts"/>
/// <reference path="../../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../../controller-base.ts"/>

module egrid.app {
  export class ProjectGridEditController extends ControllerBase {
    public static $inject : string[] = ['$window', '$q', '$rootScope', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan', 'grid', 'project', 'participants'];
    public static resolve = {
      grid: ['$q', '$stateParams', ($q, $stateParams) => {
        return $q.when(model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']));
      }],
      participants: ['$q', '$stateParams', ($q, $stateParams) => {
        return $q.when(model.Participant.query($stateParams['projectKey']));
      }],
    };
    egm : EGM;
    filter : {} = {};
    participantState : {} = {};

    constructor(
        $window,
        private $q,
        $rootScope,
        private $state,
        private $scope,
        private $modal,
        $timeout,
        $filter,
        alertLifeSpan,
        private grid: model.ProjectGrid,
        private project: model.Project,
        private participants: model.Participant[]) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      var __this = this;

      var egmui = egrid.egmui();
      this.egm = egmui.egm();
      this.egm.showRemoveLinkButton(true);
      var calcHeight = () => {
        return $(window).height() - 100; //XXX
      };
      d3.select("#display")
        .attr({
          width: $(window).width(),
          height: calcHeight(),
        })
        .call(this.egm.display($(window).width(), calcHeight()))
        ;
      d3.select(window)
        .on('resize', () => {
          d3.select("#display")
            .attr({
              width: $(window).width(),
              height: calcHeight(),
            })
            ;
        })
        ;

      d3.select("#undoButton")
        .call(egmui.undoButton()
            .onEnable(() => {
              d3.select("#undoButton").classed("disabled", false);
            })
            .onDisable(() => {
              d3.select("#undoButton").classed("disabled", true);
            }));
      d3.select("#redoButton")
        .call(egmui.redoButton()
            .onEnable(() => {
              d3.select("#redoButton").classed("disabled", false);
            })
            .onDisable(() => {
              d3.select("#redoButton").classed("disabled", true);
            }));

      d3.select("#exportSVG")
        .on("click", function() {
          __this.hideNodeController();
          __this.egm.exportSVG((svgText : string) => {
            var base64svgText = btoa(unescape(encodeURIComponent(svgText)));
            d3.select(this).attr({
              href: "data:image/svg+xml;charset=utf-8;base64," + base64svgText,
              download: __this.project.name + '.svg',
            });
            });
        });

      d3.select("#removeNodeButton")
        .call(egmui.removeNodeButton()
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#mergeNodeButton")
        .call(egmui.mergeNodeButton()
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#editNodeButton")
        .call(egmui.editNodeButton()
            .onClick(callback => {
              var node = this.egm.selectedNode();
              this.openInputTextDialog(callback, node.text)
            })
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );

      d3.select("#filterButton")
        .on("click", () => {
          var node = this.egm.selectedNode();
          this.participants.forEach(participant => {
            if (node) {
              this.participantState[participant.key] = node.participants.indexOf(participant.key) >= 0;
            } else {
              this.participantState[participant.key] = false;
            }
          });
          var m = $modal.open({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: '/partials/filter-participants-dialog.html',
            controller: ($scope, $modalInstance) => {
              $scope.results = this.filter;
              $scope.participants = this.participants;
              $scope.active = this.participantState;
              $scope.close = () => {
                $modalInstance.close($scope.results);
              };
            },
          });
          m.result.then(result => {
            this.egm.nodes().forEach(d => {
              d.active = d.participants.some(key => result[key]);
            });
            this.egm
              .draw()
              .focusCenter()
              ;
          });
          $scope.$apply();
        })
        ;

      d3.select("#layoutButton")
        .on("click", () => {
          var m = $modal.open({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: '/partials/setting-dialog.html',
            controller: ($scope, $modalInstance) => {
              $scope.options = this.egm.options();
              $scope.ViewMode = egrid.ViewMode;
              $scope.InactiveNode = egrid.InactiveNode;
              $scope.RankDirection = egrid.RankDirection;
              $scope.ScaleType = egrid.ScaleType;
              $scope.close = () => {
                $modalInstance.close();
              }
            },
          });
          m.result.then(() => {
            this.egm
              .draw()
              .focusCenter()
              ;
          });
          $scope.$apply();
        })
        ;

        var nodes = this.grid.nodes.map(d => new Node(d.text, d.weight, d.original, d.participants));
        var links = this.grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
        this.egm
          .nodes(nodes)
          .links(links)
          .draw()
          .focusCenter()
          ;
        this.participants.forEach(participant => {
          this.participantState[participant.key] = false;
          this.filter[participant.key] = true;
        });
    }

    save() {
      this.grid.nodes = this.egm.grid().nodes();
      this.grid.links = this.egm.grid().links().map(link => {
        return {
          source: link.source.index,
          target: link.target.index,
          weight: link.weight,
        };
      });
      this.$q.when(this.grid.save())
        .then(() => {
          this.$state.go('egrid.projects.get.analyses.get.grid', {projectKey: this.grid.projectKey});

          this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.showAlert(k, 'danger');
        })
        ;
    }

    private openInputTextDialog(callback, initialText : string = '') {
      var texts = [];
      var m = this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/input-text-dialog.html',
        controller: ($scope, $modalInstance) => {
          $scope.result = initialText;
          $scope.texts = texts;
          $scope.close = function(result) {
            $modalInstance.close(result);
          }
        },
      });
      m.result.then(result => {
        callback(result);
      });
      this.$scope.$apply();
    }

    private showNodeController(selection) {
      if (!selection.empty()) {
        var nodeRect = selection.node().getBoundingClientRect();
        var controllerWidth = $("#nodeController").width();
        d3.select("#nodeController")
          .classed("invisible", false)
          .style("top", nodeRect.top + nodeRect.height + 10 - 100 + "px")
          .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
          ;
      }
    }

    private hideNodeController() {
      d3.select("#nodeController")
        .classed("invisible", true);
    }

    private moveNodeController(selection) {
      var nodeRect = selection.node().getBoundingClientRect();
      var controllerWidth = $("#nodeController").width();
      d3.select("#nodeController")
        .style("top", nodeRect.top + nodeRect.height + 10 + "px")
        .style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px")
        ;
    }

    public exportJSON($event) {
      $($event.currentTarget).attr({
        href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.egm.grid().toJSON())),
        download: this.project.name + '.json',
      });
    }
  }
}
