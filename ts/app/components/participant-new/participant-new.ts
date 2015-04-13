/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ParticipantNewController implements model.ParticipantData {
    public static $inject : string[] = ['$q', '$stateParams', '$state', 'showAlert'];
    projectKey : string;
    name : string;
    note : string;

    constructor(private $q, $stateParams, private $state, private showAlert) {
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
          this.showAlert('MESSAGES.SAVED');
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.showAlert(k, 'danger');
        })
        ;
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants.all.new', {
          url: '/new',
          views: {
            'sub-tab-content@egrid.projects.get.participants.all': {
              controller: 'ParticipantNewController as newParticipant',
              templateUrl: '/components/participant-new/participant-new.html',
            },
          },
        });
    }])
    .controller('ParticipantNewController', ParticipantNewController);
}
