/// <reference path="../../../typings/angularjs/angular.d.ts"/>

interface IImportJsonButtonScope extends ng.IScope {
  onimport: any;
}

class ImportJsonButtonController {
  private onimport: any;

  constructor($scope: IImportJsonButtonScope, private $modal) {
    this.onimport = $scope.onimport;
  }

  openDialog() {
    this.$modal
      .open({
        controller: ($scope, $modalInstance) => {
          $scope.ok = (jsonFile) => {
            if (jsonFile) {
              $modalInstance.close(jsonFile);
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
      .then((jsonFile) => {
        var reader = new FileReader();
        reader.onload = (e: any) => {
          this.onimport(JSON.parse(e.target.result));
        };
        reader.readAsText(jsonFile);
      });
  }
}

angular.module('egrid')
  .directive('importJsonButton', [() => {
    return {
      controller: 'ImportJsonButtonController as importJsonButton',
      replace: true,
      restrict: 'E',
      scope: {
        onimport: '='
      },
      templateUrl: '/partials/directives/import-json-button.html'
    };
  }]);
