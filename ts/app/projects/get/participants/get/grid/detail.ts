/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/core/lib.extend.d.ts"/>
/// <reference path="../../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../../controller-base.ts"/>

module egrid.app {
  export class ParticipantGridEditController extends ControllerBase {
    public static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan', 'participant', 'grid', 'projectGrid'];
    public static resolve = {
      participant: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Participant.get($stateParams['projectKey'], $stateParams['participantKey']));
      }],
      grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ParticipantGrid.get($stateParams['projectKey'], $stateParams['participantKey']));
      }],
      projectGrid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ProjectGrid.get($stateParams['projectKey']));
      }],
    };
    participantKey : string;
    egm : EGM;
    overallNodes : model.ProjectGridNodeData[];
    disableCompletion : boolean = false;

    constructor(
        $window,
        $q,
        $rootScope,
        $stateParams,
        $state,
        private $scope,
        private $modal,
        $timeout, $filter,
        alertLifeSpan,
        private participant,
        grid,
        projectGrid) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      var __this = this;
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
        if (!d3.select("#undoButton").classed("disabled") && toState.url != '/grid') {
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
              grid.nodes = data.nodes;
              grid.links = data.links;
              $q.when(grid.update())
                .then(() => {
                  $state.go('egrid.projects.get.participants.get.grid', {}, {reload: true});

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
              download: __this.participant.project.name + ' - ' + __this.participant.name + '.svg',
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

      var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original));
      var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
      this.egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
      this.overallNodes = projectGrid.nodes;
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
            if (p == this.participant.key) {
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
      $($event.currentTarget).attr({
        href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.egm.grid().toJSON())),
        download: this.participant.project.name + ' - ' + this.participant.name + '.svg',
      });
    }
  }
}
