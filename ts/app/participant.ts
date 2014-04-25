/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>

module egrid.app {
  export class ParticipantController extends ControllerBase implements model.ParticipantData {
    private static $inject : string[] = ['$window', '$q', '$rootScope', '$stateParams', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan'];
    name : string;
    note : string;
    project : model.ProjectData;
    projectKey : string;
    participant : model.Participant;

    constructor(private $window, private $q, $rootScope, $stateParams, private $state, private $scope, private $modal, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.participant = new model.Participant({ projectKey: $stateParams.projectId });

      this.$q.when(this.participant.get($stateParams.participantId))
        .then((p: model.Participant) => {
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }

    public update() {
      this.$q.when(this.participant.save())
        .then((participant: model.Participant) => {
          // バインドしてるから要らない気はする
          this.participant.name = participant.name;
          this.participant.note = participant.note;
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }

    public confirm() {
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

      modalInstance.result.then(() => { this.remove(); });
    }

    private remove() {
      this.$q.when(this.participant.remove())
        .then(() => {
          this.$state.go('projects.get.participants.all.list');
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }
}
