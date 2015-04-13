/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('egrid')
  .factory('showMessageDialog', ['$modal', ($modal) => {
    return (message) =>{
      return $modal.open({
        controller: ($scope, $modalInstance, message) => {
          $scope.message = message;

          $scope.ok = () => {
            $modalInstance.close();
          };
        },
        resolve: {
          message: () => message
        },
        templateUrl: '/partials/dialogs/message.html'
      });
    };
  }]);
