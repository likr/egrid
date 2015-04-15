/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/d3/d3.d.ts"/>
/// <reference path="../../../../typings/egrid-core/egrid-core.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

class AnalysisSynonymController {
  public static $inject: string[] = [
    '$q',
    'showAlert',
    'grid'
  ];

  private constructs: any[];
  private groups: any[] = [];
  private unsorted: (node: any, index: number) => boolean;

  constructor(private $q, private showAlert, private gridData) {
    this.constructs = this.gridData.nodes.map((node, i) => {
      return {
        index: i,
        group: null,
        node: node
      };
    });
    this.addGroup();

    this.unsorted = (construct: any) : boolean => {
      return construct.group === null;
    };
  }

  addGroup() : void {
    this.groups.push({
      index: this.groups.length,
      label: '',
      constructs: []
    });
  }

  onDrop(event: any, ui: any, groupIndex: number) : void {
    var synonym = (<any>this).synonym;
    var construct = synonym.constructs[(<any>this).target];
    construct.index = (<any>this).target;
    if (construct.group !== null) {
      var previousGroup = synonym.groups[construct.group];
      previousGroup.constructs = previousGroup.constructs.filter(c => {
        return c.index !== construct.index;
      });
    }
    if (groupIndex === null) {
      construct.group = null;
    } else {
      synonym.groups[groupIndex].constructs.push(construct);
      construct.group = groupIndex;
    }
  }

  save() : void {
    var grid = egrid.core.grid();
    var graph = grid.graph();
    this.gridData.nodes.forEach(node => {
      graph.addVertex(node);
    });
    this.gridData.links.forEach(link => {
      graph.addEdge(link.source, link.target);
    });
    this.groups.forEach(group => {
      var i, n;
      var u = group.constructs[0].index;
      for (i = 1, n = group.constructs.length; i < n; ++i) {
        u = grid.merge(u, group.constructs[i].index);
      }
      var node: any = graph.get(u);
      if (group.label) {
        node.text = group.label;
      }
      node.texts = group.constructs.map(construct => construct.node.text);
      var participants = d3.set();
      group.constructs.forEach(construct => {
        construct.node.participants.forEach(participant => {
          participants.add(participant);
        });
      });
      node.participants = participants.values();
    });
    var obj = egrid.core.graph.dumpJSON(graph);
    this.gridData.nodes = obj.nodes;
    this.gridData.links = obj.links;
    var newIndices = {};
    graph.vertices().forEach((u, i) =>{
      newIndices[u] = i;
    });
    this.gridData.links.forEach(link => {
      link.source = newIndices[link.source];
      link.target = newIndices[link.target];
    });
    this.$q.when(this.gridData.save())
      .then(() => {
        this.showAlert('MESSAGES.UPDATED');
      }, (...reasons: any[]) => {
        var k: string = reasons[0].status === 401
          ? 'MESSAGES.NOT_AUTHENTICATED'
          : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';
        this.showAlert(k, 'danger');
      });
  }
}

angular.module('egrid')
  // .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
  //   $stateProvider
  //     .state('egrid.projects.get.analyses.get.synonym', {
  //       url: '/synonym',
  //       views: {
  //         'tab-content@egrid.projects.get.analyses.get': {
  //           controller: 'AnalysisSynonymController as analysisSynonym',
  //           templateUrl: '/components/analysis-synonym/analysis-synonym.html',
  //         },
  //       },
  //     })
  // }])
  .controller('AnalysisSynonymController', AnalysisSynonymController);
