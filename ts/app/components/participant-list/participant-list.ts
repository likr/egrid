/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../pagination.ts"/>

module egrid.app {
  class ParticipantListController extends PaginationController {
    public static $inject: string[] = [];

    constructor(private participants) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;
    }
  }

  angular.module('egrid')
    .controller('ParticipantListController', ParticipantListController);
}
