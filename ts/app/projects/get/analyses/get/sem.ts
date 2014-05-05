/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../../lib/egrid-core.d.ts"/>
/// <reference path="../../../../../lib/sem.d.ts"/>

var Sem = {
  sem: sem,
  cov: cov,
};

module egrid.app {
export class SemProjectAnalysisController {
  public static $inject: string[] = ['$scope', 'grid', 'questionnaire'];
  public static resolve = {
    grid: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
      return model.ProjectGrid.get($stateParams['projectKey'], $stateParams['analysisKey']);
    }],
    questionnaire: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
      return model.Questionnaire.get($stateParams['projectKey'], $stateParams['analysisKey']);
    }],
  };
  public encoding: string = 'utf-8';
  public gfiValue: number = 0;
  public items: Node[];
  public factorCount: number = 1;
  private egm: egrid.EGM;
  private dag: egrid.SEM;
  private SDict: any;

  constructor(
      private $scope,
      private grid: model.ProjectGrid,
      private questionnaire: model.Questionnaire) {
    var nodes = grid.nodes.map(node => new Node(node.text, node.weight, node.original, node.participants));
    var links = grid.links.map(link => new Link(nodes[link.source], nodes[link.target], link.weight));
    this.egm = new EGM;
    this.egm.nodes(nodes)
    this.egm.links(links);
    this.dag = egrid.sem();

    this.dag.registerUiCallback(() => {
      this.calcPath();
    })

    var width = $("#sem-analysis-display").width();
    var height = $("#sem-analysis-display").height();
    d3.select("#sem-analysis-display svg")
      .call(this.dag.display(width, height));
  }

  loadFile() {
    var file = (<any>d3.select("#fileInput").node()).files[0];
    var reader = new FileReader();
    reader.onload = e => {
      var data = d3.csv.parse(e.target.result);
      var attributes = [];
      for (var attr in data[0]) {
        attributes.push(attr);
      }
      var x = attributes.map(key => {
        return data.map(d => {
          return d[key];
        });
      });
      var indices = {};
      this.egm.nodes().forEach(node => {
        indices[node.text] = node.index;
      });
      var links = [];
      attributes.forEach((attr1, i) => {
        var index1 = indices[attr1];
        attributes.forEach((attr2, j) => {
          var index2 = indices[attr2];
          if (index1 != index2 && this.egm.grid().hasPath(index1, index2)) {
            links.push({
              source: i,
              target: j,
            });
          }
        });
      });
      Sem.cov(x, cov => {
        var S = cov.data;
        this.loadData(attributes, links, S);
        this.$scope.$apply();
      });
    };
    reader.readAsText(file, this.encoding);
  }

  addFactor() {
    this.dag.appendNode('潜在変数' + this.factorCount++);
    this.dag.draw().focusCenter();
    this.calcPath();
  }

  removeNode() {
    this.dag.draw().focusCenter();
    this.calcPath();
  }

  private loadData(nodes, links, S) {
    this.SDict = {};
    nodes.forEach(node => {
      this.SDict[node] = {};
    });
    nodes.forEach((node1, i) => {
      nodes.forEach((node2, j) => {
        this.SDict[node1][node2] = S[i][j];
      });
    });

    var egmNodes = nodes.map((d) => {
      return new egrid.Node(d);
    });
    var egmLinks = links.map((d) => {
      return new egrid.Link(egmNodes[d.target], egmNodes[d.source]);
    });

    this.dag.nodes(egmNodes).links(egmLinks);
    this.items = this.dag.nodes();

    var n = nodes.length;
    var alpha = links.map((d) => {
      return [d.target, d.source];
    });
    var sigma = nodes.map((_, i) => {
      return [i, i];
    });
    Sem.sem(n, alpha, sigma, S, ((result) => {
      var A = this.dag.nodes().map(() => {
        return this.dag.nodes().map(() => {
          return 0;
        });
      });
      result.alpha.forEach((r) => {
        A[r[0]][r[1]] = r[2];
      });
      this.gfiValue = result.GFI;
      this.dag.links().forEach((link: any) => {
        link.coef = A[link.source.index][link.target.index];
      });
      this.dag.draw().focusCenter();
      this.$scope.$apply();
    }));
  }

  private calcPath() {
    var nodes = this.dag.activeNodes();
    var links = this.dag.activeLinks();
    var nodesDict = {};
    nodes.forEach((node, i) => {
      nodesDict[node.text] = i;
    });
    var n = nodes.length;
    var alpha = links.map(link => {
      return [nodesDict[link.source.text], nodesDict[link.target.text]];
    });
    var sigma = nodes.map((_, i) => {
      return [i, i];
    });
    var S = this.items.map(node1 =>{
      return this.items.map(node2 => {
        return this.SDict[node1.text][node2.text];
      });
    });
    Sem.sem(n, alpha, sigma, S, (result => {
      var A = nodes.map(() => {
        return nodes.map(() => {
          return 0;
        });
      });
      result.alpha.forEach(r => {
        A[r[0]][r[1]] = r[2];
      });
      this.gfiValue = result.GFI;
      this.dag.links().forEach((link: any) => {
        link.coef = A[nodesDict[link.source.text]][nodesDict[link.target.text]];
      });
      this.dag.draw().focusCenter();
      this.$scope.$apply();
    }));
  }
}
}
