/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('egrid')
  .factory('showWordCloudDialog', ['$modal', ($modal) => {
    return (texts) => {
      return $modal.open({
        controller: ($scope, $modalInstance, texts) => {
          $scope.texts = texts;
          $scope.selectText = (text) => $modalInstance.close(text);
          $scope.close = () => {
            $modalInstance.dismiss();
          };
        },
        resolve: {
          texts: () => texts
        },
        templateUrl: '/partials/dialogs/word-cloud.html'
      });
    };
  }]);
