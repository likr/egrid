/// <reference path="../../../../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../../../../typings/d3-downloadable/d3-downloadable.d.ts"/>
/// <reference path="../../../../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../../../../../../typings/egrid-core/egrid-core.d.ts"/>

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


  enum Paint {
    None,
    UserDefined,
    Community
  }


  interface GridNode extends egrid.core.GridNode {
    color?: string;
    community?: number;
    original: boolean;
    participants: string[];
  }


  interface GridLink extends egrid.core.GridLink {
  }


  interface LayoutOptions {
    backgroundColor: any;
    dagreEdgeSep: number;
    dagreNodeSep: number;
    dagreRankDirection: RankDirection;
    dagreRankSep: number;
    edgeWidth: number;
    filter: Filter;
    importance: Importance;
    lowerStrokeColor: any;
    maxTextLength: number;
    maxVertexScale: number;
    minVertexScale: number;
    minimumImportance: number;
    paint: Paint;
    selectedStrokeColor: any;
    strokeColor: any;
    transitionDelay: number;
    transitionDuration: number;
    upperStrokeColor: any;
    vertexStrokeWidth: number;
  }


  export class ProjectGridEditController {
    public static $inject : string[] = [
      '$q',
      '$state',
      '$scope',
      '$modal',
      '$translate',
      'showAlert',
      'showWordCloudDialog',
      'kuromojiTokenizer',
      'grid',
      'project',
      'participants'
    ];
    public static resolve = {
      participants: ['$q', '$stateParams', ($q, $stateParams) => {
        return $q.when(model.Participant.query($stateParams['projectKey']));
      }],
      kuromojiTokenizer: ['getKuromojiTokenizer', (getKuromojiTokenizer) => {
        return getKuromojiTokenizer();
      }],
    };
    egm: egrid.core.EGM<GridNode, GridLink>;
    grid: egrid.core.Grid<GridNode, GridLink>;
    selection: D3.Selection;
    filter: {} = {};
    changed: boolean = false;
    saved: boolean = false;
    searchText: string = '';
    showControl: boolean = true;
    private layoutOptions: LayoutOptions = {
      backgroundColor: '#f5f5f5',
      dagreEdgeSep: 10,
      dagreNodeSep: 20,
      dagreRankDirection: RankDirection.LR,
      dagreRankSep: 30,
      edgeWidth: 1,
      filter: Filter.Transparent,
      importance: Importance.Centrality,
      lowerStrokeColor: '#ff0000',
      maxTextLength: 10,
      maxVertexScale: 3,
      minVertexScale: 1,
      minimumImportance: 0,
      paint: Paint.UserDefined,
      selectedStrokeColor: '#800080',
      strokeColor: '#000000',
      transitionDelay: 100,
      transitionDuration: 300,
      upperStrokeColor: '#0000ff',
      vertexStrokeWidth: 2,
    };

    constructor(
        private $q,
        private $state,
        private $scope,
        private $modal,
        private $translate,
        private showAlert,
        private showWordCloudDialog,
        private kuromojiTokenizer,
        private gridData: model.ProjectGrid,
        private project: model.Project,
        private participants: model.Participant[]) {

      this.participants.forEach(participant => {
        this.filter[participant.key] = true;
      });

      this.grid = egrid.core.grid<GridNode, GridLink>(this.gridData.nodes, this.gridData.links);
      var graph: egrid.core.Graph<GridNode, GridLink> = this.grid.graph();

      var width = $(window).width();
      var height = $(window).height() - 100;
      var communityColor = d3.scale.category20();
      this.egm = egrid.core.egm()
        .contentsMargin(10)
        .contentsScaleMax(2)
        .edgeColor((u, v) => {
          if (this.layoutOptions.paint === Paint.Community) {
            if (graph.get(u).community === graph.get(v).community) {
              return communityColor(graph.get(u).community);
            } else {
              return '#ccc';
            }
          }
          return null;
        })
        .edgeOpacity((u, v) => {
          if (graph.get(u).text.indexOf(this.searchText) >= 0 && graph.get(v).text.indexOf(this.searchText) >= 0) {
            return 1;
          } else {
            return 0.3;
          }
        })
        .vertexColor((d: GridNode) => {
          if (this.layoutOptions.paint === Paint.UserDefined) {
            return d.color;
          } else if (this.layoutOptions.paint === Paint.Community) {
            return communityColor(d.community);
          }
          return null;
        })
        .vertexButtons([
          {
            icon: 'images/glyphicons_210_left_arrow.png',
            onClick: (d, u) => {
              this.openInputTextDialog().then((result: string) => {
                var v = this.grid.ladderUp(u, result);
                this.grid.graph().get(v).participants = [];
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
                var v = this.grid.ladderDown(u, result);
                this.grid.graph().get(v).participants = [];
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
        .size([width, height]);
      var downloadable = d3.downloadable({
        filename: this.project.name,
        width: width,
        height: height
      });
      this.updateLayoutOptions();
      this.selection = d3.select('#display')
        .datum(this.grid.graph())
        .call(this.egm)
        .call(this.egm.center())
        .call(downloadable);

      d3.select(window)
        .on('resize', () => {
          var width = $(window).width();
          var height = $(window).height() - 100;
          downloadable
            .width(width)
            .height(height);
          this.selection
            .call(this.egm.resize(width, height));
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
      var selectedVertices = this.selection.selectAll('g.vertex.selected');
      if (selectedVertices.size() !== 2) {
        return true;
      }
      var graph = this.grid.graph();
      var nodes = selectedVertices.data();
      var u = nodes[0].key;
      var v = nodes[1].key;
      if (graph.edge(u, v) || graph.edge(v, u)) {
        return false;
      }
      return this.selection.selectAll('g.edge.upper.lower').size() > 0;
    }

    paintDisabled() {
      if (this.layoutOptions.paint !== Paint.UserDefined) {
        return true;
      }
      if (this.selection.selectAll('g.vertex.selected').size() === 0) {
        return true;
      }
      return false;
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
      this.gridData.nodes = graph.vertices().map((u, i): any => {
        vertexMap[u] = i;
        return graph.get(u);
      });
      this.gridData.links = graph.edges().map((edge): any => {
        return {
          source: vertexMap[edge[0]],
          target: vertexMap[edge[1]]
        };
      });

      this.$q.when(this.gridData.save())
        .then(() => {
          this.saved = true;
          this.$state.go('egrid.projects.get.analyses.get.grid');

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
          .delay(this.layoutOptions.transitionDelay)
          .duration(this.layoutOptions.transitionDuration)
          .call(this.egm)
          .call(this.egm.center());
      });
    }

    private openInputTextDialog(initialText : string = '') {
      var texts = this.grid.graph().vertices().map((u) => {
        var d = this.grid.graph().get(u);
        return {
          text: d.text,
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
          $scope.Paint = Paint;
          $scope.close = () => {
            $modalInstance.close($scope.options);
          }
        },
      }).result;
    }

    private openWordCloud() {
      var textCount = {};
      var nodes = this.selection.selectAll('g.vertex').data();
      var graph = this.grid.graph();
      nodes.forEach(node => {
        this.separateText(node.data.text)
          .forEach(text => {
            text = text.toLowerCase();
            if (!textCount[text]) {
              textCount[text] = 0;
            }
            textCount[text] += node.data.participants.length;
          });
      });
      var texts = Object.keys(textCount).map(text => {
        return {
          key: text,
          value: textCount[text]
        };
      });
      this.showWordCloudDialog(texts).result
        .then(text => {
          this.searchText = text;
        });
    }

    private separateText(text: string) : string[] {
      if (this.$translate.use() === 'ja') {
        var poss = d3.set(['名詞', '動詞', '形容詞', '形容動詞']);
        return this.kuromojiTokenizer.tokenize(text)
          .filter(d => poss.has(d.pos))
          .map(d => d.basic_form);
      } else {
        return text.split(' ');
      }
    }

    private updateLayoutOptions() {
      var graph = this.grid.graph();

      if (this.layoutOptions.paint === Paint.Community) {
        egrid.core.network.community.newman(graph).forEach((community, i) => {
          community.forEach(u => {
            graph.get(u).community = i;
          });
        });
      }

      var importance;
      if (this.layoutOptions.importance === Importance.Weight) {
        importance = (u) => graph.get(u).participants.length;
      } else if (this.layoutOptions.importance === Importance.Centrality) {
        var centrality = egrid.core.network.centrality.katz(graph);
        importance = (u) => centrality[u];
      } else {
        importance = () => 1;
      }
      var ranks = createRanks();

      var vertexImportance = d3.scale.linear()
        .domain(d3.extent(graph.vertices(), importance))
        .range([0, 1]);
      var vertexScale = d3.scale.linear()
        .domain([0, 1])
        .range([this.layoutOptions.minVertexScale, this.layoutOptions.maxVertexScale]);

      this.egm
        .backgroundColor(this.layoutOptions.backgroundColor)
        .strokeColor(this.layoutOptions.strokeColor)
        .upperStrokeColor(this.layoutOptions.upperStrokeColor)
        .lowerStrokeColor(this.layoutOptions.lowerStrokeColor)
        .selectedStrokeColor(this.layoutOptions.selectedStrokeColor)
        .dagreEdgeSep(this.layoutOptions.dagreEdgeSep)
        .dagreNodeSep(this.layoutOptions.dagreNodeSep)
        .dagreRankDir(this.layoutOptions.dagreRankDirection === RankDirection.TB ? 'TB' : 'LR')
        .dagreRankSep(this.layoutOptions.dagreRankSep)
        .edgeWidth(() => this.layoutOptions.edgeWidth)
        .maxTextLength(this.layoutOptions.maxTextLength)
        .vertexScale((d, u) => {
          return vertexScale(vertexImportance(importance(u)));
        })
        .vertexStrokeWidth(() => this.layoutOptions.vertexStrokeWidth)
        .vertexOpacity((d) => {
          var opacity = 1;
          if (this.layoutOptions.filter === Filter.Transparent) {
            if (d.participants.length > 0 && !d.participants.some((key) => this.filter[key])) {
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
          if (ranks[u] < this.layoutOptions.minimumImportance) {
            return false;
          }
          return true;
        })

      function createRanks() {
        var ranks = {};
        var vertices = graph.vertices().map(u => u);
        vertices.sort((u, v) => {
          return d3.ascending(importance(u), importance(v));
        });
        var n = vertices.length;
        var rank, value;
        vertices.forEach((u, i) => {
          if (importance(u) !== value) {
            rank = i
            value = importance(u);
          }
          ranks[u] = rank;
        });
        var scale = d3.scale.linear()
          .domain([0, rank])
          .range([0, 1]);
        vertices.forEach((u) => {
          ranks[u] = scale(ranks[u]);
        });
        return ranks;
      }
    }

    toggleControl() {
      this.showControl = !this.showControl;
    }
  }
}
