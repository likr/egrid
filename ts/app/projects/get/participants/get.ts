/// <reference path="../../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../../lib/egrid-client.d.ts"/>

module egrid.app {
  class ParticipantController {
    public static $inject: string[] = ['participant', 'participants'];
    public prevParticipant: egrid.model.Participant;
    public nextParticipant: egrid.model.Participant;

    constructor(private participant, private participants) {
      var index = -1;
      var i, n;
      for (i = 0, n = participants.length; i < n; ++i) {
        if (participants[i].key === participant.key){
          index = i;
          break;
        }
      }

      this.prevParticipant = index === 0
        ? null
        : participants[index - 1];
      this.nextParticipant = index === participants.length - 1
        ? null
        : participants[index + 1];
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants.get', {
          abstract: true,
          resolve: {
            participant: ['$q', '$stateParams',
                          ($q: ng.IQService,
                           $stateParams: ng.ui.IStateParamsService) => {
              return $q.when(model.Participant.get($stateParams['projectKey'],
                                                   $stateParams['participantKey']));
            }],
            participants: ['$q', '$stateParams',
                           ($q: ng.IQService,
                            $stateParams: ng.ui.IStateParamsService) => {
              return $q.when(model.Participant.query($stateParams['projectKey']));
            }]
          },
          url: '/{participantKey}',
          views: {
            'content@egrid': {
              controller: 'ParticipantController as ctrl',
              templateUrl: 'partials/projects/get/participants/get.html',
            },
          },
        })
    }])
    .controller('ParticipantController', ParticipantController);
}
