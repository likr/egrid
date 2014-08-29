/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../../ts-definitions/DefinitelyTyped/core/lib.extend.d.ts"/>
/// <reference path="../../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../../controller-base.ts"/>

module egrid.app {
  enum Importance {
    Weight,
    Centrality
  }


  enum RankDirection {
    LR,
    TB
  }


  enum Filter {
    Invisible,
    Transparent
  }


  interface LayoutOptions {
    importance: Importance;
    maxTextLength: number;
    maxVertexScale: number;
    minimumImportance: number;
    rankDirection: RankDirection;
    filter: Filter;
  }


  export class ProjectGridEditController extends ControllerBase {
    public static $inject : string[] = ['$window', '$q', '$rootScope', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan', 'grid', 'project', 'participants'];
    public static resolve = {
      participants: ['$q', '$stateParams', ($q, $stateParams) => {
        return $q.when(model.Participant.query($stateParams['projectKey']));
      }],
    };
    egm : any;
    grid: any;
    selection: D3.Selection;
    filter: {} = {};
    changed: boolean = false;
    saved: boolean = false;
    searchText: string = '';
    private layoutOptions: LayoutOptions = {
      importance: Importance.Centrality,
      maxTextLength: 10,
      maxVertexScale: 3,
      minimumImportance: 0,
      rankDirection: RankDirection.LR,
      filter: Filter.Transparent
    };

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

      this.participants.forEach(participant => {
        this.filter[participant.key] = true;
      });

      this.grid = egrid.core.grid(this.gridData.nodes, this.gridData.links);
      var graph = this.grid.graph();

      this.egm = egrid.core.egm()
        .edgeOpacity((u, v) => {
          if (graph.get(u).text.indexOf(this.searchText) >= 0 && graph.get(v).text.indexOf(this.searchText) >= 0) {
            return 1;
          } else {
            return 0.3;
          }
        })
        .vertexColor((d) => {
          return d.color;
        })
        .vertexButtons([
          {
            icon: 'images/glyphicons_210_left_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog().then((result: string) => {
                this.grid.ladderUp(u, result);
                this.updateLayoutOptions();
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
              this.updateLayoutOptions();
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
              this.openInputTextDialog(d.text).then((result: string) => {
                this.grid.updateConstruct(u, 'text', result);
                this.selection
                  .transition()
                  .call(this.egm);
                this.changed = true;
              });
            }
          },
          {
            icon: 'images/glyphicons_211_right_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog().then((result: string) => {
                this.grid.ladderDown(u, result);
                this.updateLayoutOptions();
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
        .size([$(window).width(), $(window).height() - 150]);
      this.updateLayoutOptions();
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

      $scope.$watch('grid.searchText', (oldValue, newValue) => {
        if (oldValue != newValue) {
          this.selection
            .transition()
            .call(this.egm.updateColor());
        }
      });
    }

    addConstruct() {
      this.openInputTextDialog().then((result: string) => {
        var u = this.grid.addConstruct(result);
        this.grid.graph().get(u).participants = [];
        this.updateLayoutOptions();
        this.selection
          .transition()
          .call(this.egm);
        this.changed = true;
      });
    }

    mergeConstructs() {
      var graph = this.grid.graph();
      var vertices = this.selection
        .selectAll('g.vertex')
        .filter((vertex) => {
          return vertex.selected;
        })
        .data()
        .map((vertex) => {
          return vertex.key;
        });
      this.grid.merge(vertices[0], vertices[1], (u, v) => {
        var uData = graph.get(u);
        var vData = graph.get(v);
        var newParticipants = d3.set();
        uData.participants.forEach((key) => newParticipants.add(key));
        vData.participants.forEach((key) => newParticipants.add(key));
        return {
          text: uData.text + ', ' + vData.text,
          participants: newParticipants.values(),
          original: uData.original || vData.original,
        };
      });
      this.updateLayoutOptions();
      this.selection
        .transition()
        .call(this.egm);
      this.changed = true;
    }

    paintConstructs() {
      this.openColorDialog().then((color) => {
        var graph = this.grid.graph();
        this.selection
          .selectAll('g.vertex')
          .each((vertex) => {
            if (vertex.selected) {
              graph.get(vertex.key).color = color;
            }
          })
          .transition()
          .call(this.egm.updateColor());
      });
    }

    undo() {
      this.grid.undo();
      this.updateLayoutOptions();
      this.selection
        .transition()
        .call(this.egm);
    }

    redo() {
      this.grid.redo();
      this.updateLayoutOptions();
      this.selection
        .transition()
        .call(this.egm);
    }

    mergeDisabled() {
      var numSelected = this.selection.selectAll('g.vertex.selected').size();
      var loop = this.selection.selectAll('g.edge.upper.lower').size() > 0;
      return numSelected != 2 || loop;
    }

    paintDisabled() {
      return this.selection.selectAll('g.vertex.selected').size() === 0;
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
      var participantState = {};
      this.participants.forEach(participant => {
        participantState[participant.key] = false;
      });
      this.selection.selectAll('g.vertex.selected').data().forEach((vertex) => {
        vertex.data.participants.forEach((key) => {
          participantState[key] = true;
        });
      });
      var m = this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/dialogs/filter-participants.html',
        controller: ($scope, $modalInstance) => {
          $scope.results = this.filter;
          $scope.participants = this.participants;
          $scope.active = participantState;
          $scope.close = () => {
            $modalInstance.close();
          };
        },
      });
      m.result.then(() => {
        this.selection
          .transition()
          .call(this.egm)
          .call(this.egm.center());
      });
    }

    openLayoutSetting() {
      this.openLayoutDialog().then(() => {
        this.updateLayoutOptions();
        this.selection
          .transition()
          .call(this.egm)
          .call(this.egm.center());
      });
    }

    private openInputTextDialog(initialText : string = '') {
      var texts = this.grid.graph().vertices().map((u) => {
        var d = this.grid.graph().get(u);
        return {
          text: d.text,
          weight: d.weight,
        };
      });
      return this.$modal.open({
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
      }).result;
    }

    private openColorDialog() {
      return this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/dialogs/color.html',
        controller: ($scope, $modalInstance) => {
          $scope.color = '#00ff00';
          $scope.submit = (color) => {
            $modalInstance.close(color);
          };
          $scope.close = () => {
            $modalInstance.dismiss();
          };
        },
      }).result;
    }

    private openLayoutDialog() {
      return this.$modal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/partials/dialogs/layout.html',
        controller: ($scope, $modalInstance) => {
          $scope.options = this.layoutOptions;
          $scope.Importance = Importance;
          $scope.RankDirection = RankDirection;
          $scope.Filter = Filter;
          $scope.close = () => {
            $modalInstance.close($scope.options);
          }
        },
      }).result;
    }

    private updateLayoutOptions() {
      var graph = this.grid.graph();
      var importance;
      if (this.layoutOptions.importance === Importance.Weight) {
        importance = (u) => graph.get(u).participants.length;
      } else if (this.layoutOptions.importance === Importance.Centrality) {
        var centrality = egrid.core.network.centrality.katz(graph);
        importance = (u) => centrality[u];
      } else {
        importance = () => 1;
      }

      var vertexImportance = d3.scale.linear()
        .domain(d3.extent(graph.vertices(), importance))
        .range([0, 1]);
      var vertexScale = d3.scale.linear()
        .domain([this.layoutOptions.minimumImportance, 1])
        .range([1, this.layoutOptions.maxVertexScale]);

      this.egm
        .dagreRankDir(this.layoutOptions.rankDirection === RankDirection.TB ? 'TB' : 'LR')
        .maxTextLength(this.layoutOptions.maxTextLength)
        .vertexScale((d, u) => {
          return vertexScale(vertexImportance(importance(u)));
        })
        .vertexOpacity((d) => {
          var opacity = 1;
          if (this.layoutOptions.filter === Filter.Transparent) {
            if (!d.participants.some((key) => this.filter[key])) {
              opacity *= 0.3;
            }
          }
          if (d.text.indexOf(this.searchText) < 0) {
            opacity *= 0.3;
          }
          return opacity;
        })
        .vertexVisibility((d, u) => {
          if (this.layoutOptions.filter === Filter.Invisible) {
            if (!d.participants.some((key) => this.filter[key])) {
              return false;
            }
          }
          if (vertexImportance(importance(u)) < this.layoutOptions.minimumImportance) {
            return false;
          }
          return true;
        })
    }

    public exportJSON($event) {
      var graph = this.grid.graph();
      var obj = {
        nodes: graph.vertices().map((u) => {
          return graph.get(u);
        }),
        links: graph.edges().map((edge) => {
          return {
            source: edge[0],
            target: edge[1],
          };
        }),
      };
      console.log(obj);
      $($event.currentTarget).attr({
        href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj)),
        download: this.project.name + '.json',
      });
    }
  }
}
