/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="controller-base.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantCreateController extends ControllerBase implements model.ParticipantData {
    projectKey : string;
    name : string;
    note : string;


    constructor(private $q, $rootScope, $stateParams, private $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var participant = new model.Participant(this);
      this.$q.when(participant.save())
        .then((p: model.Participant) => {
          this.$state.go('projects.get.participants.get.detail', { projectId: this.projectKey, participantId: p.key });

          this.showAlert('MESSAGES.OPERATION_SUCCESSFULLY_COMPLETED');
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.showAlert(k, 'danger');
        })
        ;
    }
  }
}
