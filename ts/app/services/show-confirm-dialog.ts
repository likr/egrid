/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>

angular.module('egrid')
  .factory('showConfirmDialog', ['$modal', ($modal) => {
    return (message) =>{
      return $modal.open({
        controller: ($scope, $modalInstance, message) => {
          $scope.message = message;

          $scope.ok = () => {
            $modalInstance.close();
          },

          $scope.cancel = () => {
            $modalInstance.dismiss();
          }
        },
        resolve: {
          message: () => message
        },
        templateUrl: '/partials/dialogs/confirm.html'
      });
    };
  }]);
