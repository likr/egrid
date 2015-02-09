/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/core/lib.extend.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/egrid-core/egrid-core.d.ts"/>
/// <reference path="../../../../../../lib/d3-downloadable.d.ts"/>
/// <reference path="../../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class ParticipantGridEditController {
    public static $inject : string[] = ['$q', '$stateParams', '$state', '$scope', '$modal', 'showAlert', 'project', 'participant', 'gridData', 'projectGrid'];
    public static resolve = {
      projectGrid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.ProjectGrid.get($stateParams['projectKey'], 'current'));
      }],
    };
    participantKey: string;
    egm: any;
    grid: any;
    selection: D3.Selection;
    overallNodes: model.ProjectGridNodeData[];
    disableCompletion: boolean = false;
    changed: boolean = false;
    saved: boolean = false;

    constructor(
        private $q,
        $stateParams,
        private $state,
        private $scope,
        private $modal,
        private showAlert,
        private project,
        private participant,
        private gridData,
        projectGrid) {
      if ($stateParams.disableCompletion) {
        this.disableCompletion = true;
      }

      var width = $(window).width();
      var height = $(window).height() - 150;
      this.egm = egrid.core.egm()
        .maxTextLength(10)
        .vertexButtons([
          {
            icon: 'images/glyphicons_210_left_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.ladderUp(u, result);
                this.selection
                  .transition()
                  .call(this.egm);
                this.changed = true;
              });
            }
          },
          {
            icon: 'images/glyphicons_207_remove_2.png',
            onClick: (d, u) => {
              this.grid.removeConstruct(u);
              this.selection
                .transition()
                .call(this.egm);
              this.$scope.$apply();
              this.changed = true;
            }
          },
          {
            icon: 'images/glyphicons_030_pencil.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.updateConstruct(u, 'text', result);
                this.selection
                  .transition()
                  .call(this.egm);
                this.changed = true;
              }, d.text);
            }
          },
          {
            icon: 'images/glyphicons_211_right_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.ladderDown(u, result);
                this.selection
                  .transition()
                  .call(this.egm);
                this.changed = true;
              });
            }
          },
        ])
        .onClickVertex(() => {
          this.$scope.$apply();
        })
        .size([width, height]);
      var downloadable = d3.downloadable({
        filename: this.project.name + ' - ' + this.participant.name,
        width: width,
        height: height
      });
      this.grid = egrid.core.grid(this.gridData.nodes, this.gridData.links);
      this.selection = d3.select('#display')
        .datum(this.grid.graph())
        .call(this.egm)
        .call(this.egm.center())
        .call(downloadable);

      d3.select(window)
        .on('resize', () => {
          var width = $(window).width();
          var height = $(window).height() - 150;
          downloadable
            .width(width)
            .height(height);
          this.selection
            .transition()
            .call(this.egm.resize(width, height));
        });

      $scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        if (!this.saved && this.changed) {
          if (!confirm('保存せずにページを移動しようとしています')) {
            event.preventDefault();
          }
        }
      });

      this.overallNodes = projectGrid.nodes;
    }

    addConstruct() {
      this.openInputTextDialog((result: string) => {
        this.grid.addConstruct(result);
        this.selection
          .transition()
          .call(this.egm);
        this.changed = true;
      });
    }

    mergeConstructs() {
      var vertices = this.selection
        .selectAll('g.vertex')
        .filter(function(vertex) {
          return vertex.selected;
        })
        .data()
        .map(function(vertex) {
          return vertex.key;
        });
      this.grid.merge(vertices[0], vertices[1]);
      this.selection
          .transition()
          .call(this.egm);
      this.changed = true;
    }

    undo() {
      this.grid.undo();
      this.selection
        .transition()
        .call(this.egm);
    }

    redo() {
      this.grid.redo();
      this.selection
        .transition()
        .call(this.egm);
    }

    mergeDisabled() {
      var numSelected = this.selection.selectAll('g.vertex.selected').size();
      var loop = this.selection.selectAll('g.edge.upper.lower').size() > 0;
      return numSelected != 2 || loop;
    }

    undoDisabled() {
      return !this.grid.canUndo();
    }

    redoDisabled() {
      return !this.grid.canRedo();
    }

    save() {
      var graph = this.grid.graph();
      var vertexMap = {};
      this.gridData.nodes = graph.vertices().map(function(u, i) {
        vertexMap[u] = i;
        return graph.get(u);
      });
      this.gridData.links = graph.edges().map(function(edge) {
        return {
          source: vertexMap[edge[0]],
          target: vertexMap[edge[1]]
        };
      });

      this.$q.when(this.gridData.update())
        .then(() => {
          this.saved = true;
          this.$state.go('egrid.projects.get.participants.get.grid', {}, {reload: true});

          this.showAlert('MESSAGES.UPDATED');
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.showAlert(k, 'danger');
        })
        ;
    }

    close() {
      this.$state.go('egrid.projects.get.participants.get.grid');
    }

    private openInputTextDialog(callback: (result: string) => any, initialText: string = '') {
      var texts = this.completionTexts();
      var m = this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/dialogs/input-text.html',
        controller: ($scope, $modalInstance) => {
          $scope.result = initialText;
          $scope.texts = texts;
          $scope.submit = (text) => {
            $modalInstance.close(text);
          };
          $scope.close = () => {
            $modalInstance.dismiss();
          };
        },
      });
      m.result.then(result => {
        if (result) {
          callback(result);
        }
      });
    }

    private completionTexts(): any[] {
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
        this.grid.graph().vertices().forEach(u => {
          var node = this.grid.graph().get(u);
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
      return texts;
    }
  }
}
