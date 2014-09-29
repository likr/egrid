/// <reference path="../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../controller-base.ts"/>

module egrid.app {
  export class ParticipantController extends ControllerBase {
    public static $inject : string[] = ['$window', '$q', '$rootScope', '$state', '$scope', '$modal', '$timeout', '$filter', 'alertLifeSpan', 'participant'];
    public static resolve = {
      participant: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(model.Participant.get($stateParams['projectKey'], $stateParams['participantKey']));
      }],
    };

    constructor(
        private $window,
        private $q,
        $rootScope,
        private $state,
        private $scope,
        private $modal,
        $timeout,
        $filter,
        alertLifeSpan,
        private participant) {
      super($rootScope, $timeout, $filter, alertLifeSpan);
    }

    public update() {
      this.$q.when(this.participant.save())
        .then((participant: model.Participant) => {
          this.participant.name = participant.name;
          this.participant.note = participant.note;
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.get.participants.all.list');

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
      this.$q.when(this.participant.remove())
        .then(() => {
          this.$state.go('egrid.projects.get.participants.all.list', null, {reload: true});
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            this.$state.go('egrid.projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }
}
