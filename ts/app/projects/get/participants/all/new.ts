/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../../controller-base.ts"/>

module egrid.app {
  export class ParticipantCreateController extends ControllerBase implements model.ParticipantData {
    public static $inject : string[] = ['$q', '$rootScope', '$stateParams', '$state', '$timeout', '$filter', 'alertLifeSpan'];
    projectKey : string;
    name : string;
    note : string;


    constructor(private $q, $rootScope, $stateParams, private $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.projectKey = $stateParams['projectKey'];
    }

    submit() {
      var participant = new model.Participant(this);
      this.$q.when(participant.save())
        .then((p: model.Participant) => {
          this.$state.go('egrid.projects.get.participants.get.detail', {
            projectKey: this.projectKey,
            participantKey: p.key
          });
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
