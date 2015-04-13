/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../typings/d3/d3.d.ts"/>

interface IImportCsvButtonScope extends ng.IScope {
  onimport: any;
}

class ImportCsvButtonController {
  private onimport: any;
  private encoding: string;

  constructor($scope: IImportCsvButtonScope, private $modal) {
    this.onimport = $scope.onimport;
    this.encoding = 'sjis'
  }

  openDialog() {
    this.$modal
      .open({
        controller: ($scope, $modalInstance) => {
          $scope.ok = (csvFile) => {
            if (csvFile) {
              $modalInstance.close(csvFile);
            } else {
              $modalInstance.dismiss();
            }
          };

          $scope.cancel = () => {
            $modalInstance.dismiss();
          };
        },
        templateUrl: '/partials/dialogs/select-file.html'
      })
      .result
      .then((csvFile) => {
        var reader = new FileReader();
        reader.onload = (e: any) => {
          var data = d3.csv.parse(e.target.result);
          var texts = {};
          data.forEach(link => {
            console.log(link);
            var upperText = link['上位項目'];
            texts[upperText] = {
              text: upperText
            };
            var lowerText = link['下位項目'];
            texts[lowerText] = {
              text: lowerText
            };
          });
          var indices = {};
          Object.keys(texts).forEach((key, i) => {
            indices[key] = i;
          });
          var grid = {
            nodes: Object.keys(texts).map(key => texts[key]),
            links: data.map(link => {
              return {
                source: indices[link['上位項目']],
                target: indices[link['下位項目']]
              };
            })
          };
          this.onimport(grid);
        };
        reader.readAsText(csvFile, this.encoding);
      });
  }
}

angular.module('egrid')
  .directive('importCsvButton', [() => {
    return {
      controller: 'ImportCsvButtonController as importCsvButton',
      replace: true,
      restrict: 'E',
      scope: {
        onimport: '='
      },
      templateUrl: '/partials/directives/import-csv-button.html'
    };
  }]);
