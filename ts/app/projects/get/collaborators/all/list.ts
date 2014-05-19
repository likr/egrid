/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class CollaboratorListController {
    public static $inject :string[] = ['$window', '$q', '$rootScope', '$state', '$scope', '$modal', 'collaborators'];
    public static resolve = {
      collaborators: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Collaborator.query($stateParams['projectKey']));
      }],
    };

    constructor(
        private $window,
        private $q,
        private $rootScope,
        private $state,
        private $scope,
        private $modal,
        private collaborators) {
    }

    public confirm(index: number) {
      var modalInstance = this.$modal.open({
        templateUrl: '/partials/remove-item-dialog.html',
        controller: ($scope, $modalInstance) => {
          $scope.ok = () => {
            $modalInstance.close();
          },
          $scope.cancel = () => {
            $modalInstance.dismiss();
          }
        }
      });

      modalInstance.result.then(() => {
        this.remove(index);
      });
    }

    private remove(index) {
      this.$q.when(this.collaborators[index].remove())
        .then(() => {
          this.collaborators.splice(index, 1);
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
        });
    }
  }
}
