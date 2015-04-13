/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../pagination.ts"/>

module egrid.app {
  class ParticipantListController extends PaginationController {
    public static $inject: string[] = ['participants'];
    public static resolve = {
      participants: ['$q', '$stateParams', ($q: ng.IQService, $stateParams: ng.ui.IStateParamsService) => {
        return $q.when(<any>model.Participant.query($stateParams['projectKey']))
      }],
    };

    constructor(private participants) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;
    }
  }

  angular.module('egrid')
    .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
      $stateProvider
        .state('egrid.projects.get.participants.all.list', {
          resolve: ParticipantListController.resolve,
          url: '/list',
          views: {
            'sub-tab-content@egrid.projects.get.participants.all': {
              controller: 'ParticipantListController as participantList',
              templateUrl: '/components/participant-list/participant-list.html',
            },
          },
        });
    }])
    .controller('ParticipantListController', ParticipantListController);
}
