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
    egm : any;
    grid: any;
    selection: D3.Selection;
    filter : {} = {};
    participantState : {} = {};
    changed: boolean = false;
    saved: boolean = false;

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
        private gridData: model.ProjectGrid,
        private project: model.Project,
        private participants: model.Participant[]) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.egm = egrid.core.egm()
        .maxTextLength(10)
        .vertexScale((d) => {
          return d.participants.length;
        })
        .vertexColor((d) => {
          return d.color;
        })
        .vertexButtons([
          {
            icon: 'images/glyphicons_210_left_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.ladderUp(u, result);
                this.selection.call(this.egm);
                this.changed = true;
              });
            }
          },
          {
            icon: 'images/glyphicons_207_remove_2.png',
            onClick: (d, u) => {
              this.grid.removeConstruct(u);
              this.selection.call(this.egm);
              this.$scope.$apply();
              this.changed = true;
            }
          },
          {
            icon: 'images/glyphicons_030_pencil.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.updateConstruct(u, 'text', result);
                this.selection.call(this.egm);
                this.changed = true;
              }, d.text);
            }
          },
          {
            icon: 'images/glyphicons_234_brush.png',
            onClick: (d, u) => {
              this.openColorDialog(d.color).then((color) => {
                d.color = color;
                this.selection.call(this.egm);
              });
            }
          },
          {
            icon: 'images/glyphicons_211_right_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog((result: string) => {
                this.grid.ladderDown(u, result);
                this.selection.call(this.egm);
                this.changed = true;
              });
            }
          },
        ])
        .onClickVertex(() => {
          this.$scope.$apply();
        })
        .size([$(window).width(), $(window).height() - 150]);
      this.grid = egrid.core.grid(this.gridData.nodes, this.gridData.links);
      this.selection = d3.select('#display')
        .datum(this.grid.graph())
        .call(this.egm.css())
        .call(this.egm)
        .call(this.egm.center());

      d3.select(window)
        .on('resize', () => {
          this.selection
            .call(this.egm.resize($(window).width(), $(window).height() - 150));
        })
        ;

      $scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        if (!this.saved && this.changed) {
          if (!confirm('保存せずにページを移動しようとしています')) {
            event.preventDefault();
          }
        }
      });

      this.participants.forEach(participant => {
        this.participantState[participant.key] = false;
        this.filter[participant.key] = true;
      });
    }

    addConstruct() {
      this.openInputTextDialog((result: string) => {
        this.grid.addConstruct(result);
        this.selection.call(this.egm);
        this.changed = true;
      });
    }

    mergeConstructs() {
      var vertices = this.selection
        .selectAll('g.vertex')
        .filter((vertex) => {
          return vertex.selected;
        })
        .data()
        .map((vertex) => {
          return vertex.key;
        });
      this.grid.merge(vertices[0], vertices[1]);
      this.selection.call(this.egm);
      this.changed = true;
    }

    undo() {
      this.grid.undo();
      this.selection.call(this.egm);
    }

    redo() {
      this.grid.redo();
      this.selection.call(this.egm);
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
      this.gridData.nodes = graph.vertices().map((u, i) => {
        vertexMap[u] = i;
        return graph.get(u);
      });
      this.gridData.links = graph.edges().map((edge) => {
        return {
          source: vertexMap[edge[0]],
          target: vertexMap[edge[1]]
        };
      });

      this.$q.when(this.gridData.save())
        .then(() => {
          this.saved = true;
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

    close() {
      this.$state.go('egrid.projects.get.analyses.get.grid');
    }

    openFilterSetting() {
      var graph = this.grid.graph();
      this.participants.forEach(participant => {
        this.participantState[participant.key] = false;
      });
      graph.vertices().forEach((u) => {
        graph.get(u).participants.forEach((key) => {
          this.participantState[key] = true;
        });
      });
      var m = this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/filter-participants-dialog.html',
        controller: ($scope, $modalInstance) => {
          $scope.results = this.filter;
          $scope.participants = this.participants;
          $scope.active = this.participantState;
          $scope.close = () => {
            $modalInstance.close();
          };
        },
      });
      m.result.then(() => {
        this.selection
          .call(this.egm)
          .call(this.egm.center());
      });
    }

    openLayoutSetting() {
      var m = this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/setting-dialog.html',
        controller: ($scope, $modalInstance) => {
          //$scope.options = this.egm.options();
          //$scope.ViewMode = egrid.ViewMode;
          //$scope.InactiveNode = egrid.InactiveNode;
          //$scope.RankDirection = egrid.RankDirection;
          //$scope.ScaleType = egrid.ScaleType;
          $scope.close = () => {
            $modalInstance.close();
          }
        },
      });
      m.result.then(() => {
        this.selection
          .call(this.egm)
          .call(this.egm.center());
      });
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
          $scope.close = (result) => {
            $modalInstance.close(result);
          }
        },
      });
      m.result.then(result => {
        callback(result);
      });
      this.$scope.$apply();
    }

    private openColorDialog(initialColor) {
      return this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/dialogs/color.html',
        controller: ($scope, $modalInstance) => {
          $scope.color = initialColor
          $scope.submit = (color) => {
            $modalInstance.close(color);
          };
          $scope.close = () => {
            $modalInstance.dismiss();
          };
        },
      }).result;
    }


    public exportJSON($event) {
      $($event.currentTarget).attr({
        href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.egm.grid().toJSON())),
        download: this.project.name + '.json',
      });
    }
  }
}
