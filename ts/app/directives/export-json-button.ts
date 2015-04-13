/// <reference path="../../../typings/angularjs/angular.d.ts"/>

interface IExportJsonButtonScope extends ng.IScope {
  graph: any;
  filename: string;
}

class ExportJsonButtonController {
  private graph: any;
  private filename: string;

  constructor($scope: IExportJsonButtonScope) {
    this.graph = $scope.graph;
    this.filename = $scope.filename;
  }

  export($event) {
    var obj = {
      nodes: this.graph.vertices().map((u) => {
        return this.graph.get(u);
      }),
      links: this.graph.edges().map((edge) => {
        return {
          source: edge[0],
          target: edge[1],
        };
      }),
    };
    $($event.currentTarget).attr({
      href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj)),
      download: this.filename + '.json',
    });
  }
}

angular.module('egrid')
  .directive('exportJsonButton', [() => {
    return {
      controller: ExportJsonButtonController,
      controllerAs: 'exportJsonButton',
      replace: true,
      restrict: 'E',
      scope: {
        graph: '=',
        filename: '='
      },
      templateUrl: '/partials/directives/export-json-button.html'
    };
  }]);
