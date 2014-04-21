/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/core/lib.extend.d.ts"/>
/// <reference path="../core/egm.ts"/>
/// <reference path="../core/egm-ui.ts"/>
/// <reference path="../model/participant.ts"/>
/// <reference path="../model/participant-grid.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="../model/project-grid.ts"/>
/// <reference path="controller-base.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantGridEditController extends ControllerBase {
    private static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan'];
    projectKey : string;
    participantKey : string;
    egm : EGM;
    grid : model.ParticipantGrid;
    overallNodes : model.ProjectGridNodeData[];
    disableCompletion : boolean = false;

    constructor($window, $q, $rootScope, $stateParams, $state, private $scope, private $modal, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      var __this = this;
      this.projectKey = $stateParams.projectId;
      this.participantKey = $stateParams.participantId;
      if ($stateParams.disableCompletion) {
        this.disableCompletion = true;
      }

      var egmui = egrid.egmui();
      this.egm = egmui.egm();
      this.egm.showRemoveLinkButton(true);
      this.egm.options().maxScale = 1;
      this.egm.options().showGuide = true;
      var calcHeight = () => {
        return $(window).height() - 100; //XXX
      };
      d3.select("#display")
        .attr({
          width: $(window).width(),
          height: calcHeight() - 50,
        })
        .call(this.egm.display($(window).width(), calcHeight() - 50))
        ;
      d3.select(window)
        .on('resize', () => {
          var width = $(window).width();
          var height = calcHeight() - 50;
          d3.select("#display")
            .attr({
              width: width,
              height: height,
            })
            ;
          this.egm.resize(width, height);
        })
        ;

      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (!d3.select("#undoButton").classed("disabled") && toState.url != '/detail') {
          if (!confirm('保存せずにページを移動しようとしています')) {
            event.preventDefault();
          }
        }
      });

      d3.select("#appendNodeButton")
        .call(egmui.appendNodeButton()
          .onClick(callback => this.openInputTextDialog(callback))
        );
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
      d3.select("#saveButton")
        .call(egmui.saveButton()
            .save(data => {
              this.grid.nodes = data.nodes;
              this.grid.links = data.links;
              $q.when(this.grid.update())
                .then(() => {
                  $state.go('projects.get.participants.get.evaluation');

                  this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
                }, (...reasons: any[]) => {
                  var k: string = reasons[0].status === 401
                    ? 'MESSAGES.NOT_AUTHENTICATED'
                    : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

                  this.showAlert(k, 'danger');
                })
                ;
            }));

      d3.select("#exportSVG")
        .on("click", function() {
          __this.hideNodeController();
          __this.egm.exportSVG((svgText : string) => {
            var base64svgText = btoa(unescape(encodeURIComponent(svgText)));
            d3.select(this).attr({
              href: "data:image/svg+xml;charset=utf-8;base64," + base64svgText,
              download: project.name + ' - ' + participant.name + '.svg',
            });
            });
        });

      d3.select("#ladderUpButton")
        .call(egmui.radderUpButton()
            .onClick(callback => this.openInputTextDialog(callback))
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
      d3.select("#ladderDownButton")
        .call(egmui.radderDownButton()
            .onClick(callback =>this.openInputTextDialog(callback))
            .onEnable(selection => this.showNodeController(selection))
            .onDisable(() => this.hideNodeController())
        );
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

      var project : model.Project = new model.Project;
      var participant : model.Participant = new model.Participant({
        projectKey: this.projectKey,
      });
      $q.when(project.get(this.projectKey));
      $q.when(participant.get(this.participantKey));

      $q.when(model.ParticipantGrid.get(this.projectKey, this.participantKey))
        .then((grid : model.ParticipantGrid) => {
          this.grid = grid;
          var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original));
          var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
          this.egm
            .nodes(nodes)
            .links(links)
            .draw()
            .focusCenter()
            ;
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reasons[0]['status'] === 404 || reasons[0]['status'] === 500) {
            $state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;

      $q.when(model.ProjectGrid.get(this.projectKey))
        .then((grid : model.ProjectGrid) => {
          this.overallNodes = grid.nodes;
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reasons[0]['status'] === 404 || reasons[0]['status'] === 500) {
            $state.go('projects.get.grids.get.detail');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        })
        ;
    }

    private openInputTextDialog(callback, initialText : string = '') {
      var texts;
      if (this.disableCompletion) {
        texts = [];
      } else {
        var textsDict = {};
        texts = this.overallNodes.map(d => {
          var obj = {
            text: d.text,
            weight: d.weight,
          };
          d.participants.forEach(p => {
            if (p == this.participantKey) {
              obj.weight -= 1;
            }
          });
          textsDict[d.text] = obj;
          return obj;
        });
        this.egm.nodes().forEach(node => {
          if (textsDict[node.text]) {
            textsDict[node.text].weight += 1;
          } else {
            texts.push({
              text: node.text,
              weight: 1,
            });
          }
        });
        texts.sort((t1, t2) => t2.weight - t1.weight);
      }
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
      $($event.currentTarget).attr("href", "data:application/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify(this.egm.grid().toJSON())
      ));
    }
  }
}
