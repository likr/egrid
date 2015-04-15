/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>

module egrid.app {
  class ParticipantGetController {
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
    .controller('ParticipantGetController', ParticipantGetController);
}
