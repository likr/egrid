/// <reference path="../lib/egrid-client.d.ts"/>

module egrid.app {
  export class CollaboratorListController {
    public projectId : string;
    public collaborators = new model.CollaboratorCollection();

    constructor(private $window, private $q, private $rootScope, $stateParams, private $state, private $scope, private $modal) {
      this.projectId = $stateParams.projectId;

      $q
        .when(this.collaborators.query(this.projectId))
        .then((collaborators: model.Collaborator[]) => {
          Object.keys(collaborators).forEach((v, i, ar) => {
              this.collaborators.addItem(collaborators[v]);
            });
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
        });
    }

    public confirm(key: string) {
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

      modalInstance.result.then(() => { this.remove(key); });
    }

    private remove(key) {
      this.$q.when(this.collaborators.getItem(key).remove())
        .then(() => {
          this.collaborators.removeItem(key);
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
        });
    }
  }
}
