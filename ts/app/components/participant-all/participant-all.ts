/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../lib/angular-new-router.d.ts"/>

module egrid.app {
  class ParticipantAllController {
    public static $routeConfig: Route[] = [
      {
        path: '/list',
        components: {
          subTabContent: 'participantList'
        }
      },
      {
        path: '/new',
        components: {
          subTabContent: 'participantNew'
        }
      }
    ];
  }

  angular.module('egrid')
    .controller('ParticipantAllController', ParticipantAllController);
}
