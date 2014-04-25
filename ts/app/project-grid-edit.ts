/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="../core/egm.ts"/>
/// <reference path="../core/egm-ui.ts"/>
/// <reference path="controller-base.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectGridEditController extends ControllerBase {
    private static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan'];
    projectKey : string;
    projectGridKey : string;
    grid : model.ProjectGrid;
    egm : EGM;
    filter : {} = {};
    participants = new model.ParticipantCollection();
    participantState : {} = {};

    constructor($window, private $q, $rootScope, $stateParams, private $state, private $scope, private $modal, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      var __this = this;
      this.projectKey = $stateParams.projectId;
      this.projectGridKey = $stateParams.projectGridKey;

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
            var base64svgText = btoa(encodeURIComponent(svgText));
            d3.select(this).attr({
              href: "data:image/svg+xml;charset=utf-8;base64," + base64svgText,
              download: project.name + '.svg',
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
          this.participants.toArray().forEach(participant => {
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

      var project : model.Project = new model.Project;

      this.$q.when(project.get(this.projectKey));

      this.$q.when(model.ProjectGrid.get(this.projectKey, this.projectGridKey))
        .then((grid : model.ProjectGrid) => {
          this.grid = grid;
          var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original, d.participants));
          var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
          this.egm
            .nodes(nodes)
            .links(links)
            .draw()
            .focusCenter()
            ;
        }, (reason) => {
          if (reason.status === 401) {
            $window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('projects.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;

      this.$q.when(this.participants.query(this.projectKey))
        .then((participants : model.Participant[]) => {
          Object.keys(participants).forEach((v, i, ar) => {
              this.participants.addItem(participants[v]);
            });

          this.participants.toArray().forEach(participant => {
              this.participantState[participant.key] = false;
              this.filter[participant.key] = true;
            });
        }, (reason) => {
          if (reason.status === 401) {
            $window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('projects.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;
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
        .then(grid => {
          this.$state.go('projects.get.evaluation', { projectId: grid.projectKey });

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
  }
}
