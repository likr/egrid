/// <reference path="../../lib/egrid-client.d.ts"/>

module egrid.app {
  export class ProjectController {
    public static $inject : string[] = ['$window', '$q', '$state', '$modal', 'showAlert', 'authorization', 'project'];

    constructor(private $window, private $q, private $state, private $modal, private showAlert, private authorization, public project : model.Project) {
    }

    public update() {
      this.$q.when(this.project.save())
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.project.name = project.name;
          this.project.note = project.note;
          this.showAlert('MESSAGES.UPDATED');
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.authorization.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }

    public confirm() {
      var modalInstance = this.$modal.open({
        templateUrl: '/partials/dialogs/remove-item.html',
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
        this.remove();
      });
    }

    private remove() {
      this.$q.when(this.project.remove())
        .then(() => {
          this.showAlert('MESSAGES.REMOVED');
          this.$state.go('egrid.projects.all.list', null, {reload: true});
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.authorization.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }
}
