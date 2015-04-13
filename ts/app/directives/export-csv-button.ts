/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../lib/encoding.d.ts"/>

interface IExportCsvButtonScope extends ng.IScope {
  graph: any;
  filename: string;
}

class ExportCsvButtonController {
  private graph: any;
  private filename: string;

  constructor($scope: IExportCsvButtonScope) {
    this.graph = $scope.graph;
    this.filename = $scope.filename;
  }

  export($event) {
    var csvRows = ['上位項目,下位項目'];
    this.graph.edges().forEach((edge) => {
      var u = edge[0],
        v = edge[1];
      csvRows.push(this.graph.get(u).text + ',' + this.graph.get(v).text);
    });
    var unicodeArray = Encoding.stringToCode(csvRows.join('\r\n'));
    var sjisArray = Encoding.convert(unicodeArray, 'SJIS', 'UNICODE');
    $($event.currentTarget).attr({
      href: "data:text/comma-separated-values;charset=sjis," + Encoding.urlEncode(sjisArray),
      download: this.filename + '.csv',
    });
  }
}

angular.module('egrid')
  .directive('exportCsvButton', [() => {
    return {
      controller: ExportCsvButtonController,
      controllerAs: 'exportCsvButton',
      replace: true,
      restrict: 'E',
      scope: {
        graph: '=',
        filename: '='
      },
      templateUrl: '/partials/directives/export-csv-button.html'
    };
  }]);
