/// <reference path="../lib/egrid-client.d.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ParticipantListController extends PaginationController {
    public projectId : string;
    public participants = new model.ParticipantCollection();

    constructor($window, $q, $rootScope, $stateParams) {
      super();

      this.projectId = $stateParams.projectId;
      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.participants.query(this.projectId))
        .then((participants: model.Participant[]) => {
          Object.keys(participants).forEach((v, i, ar) => {
              this.participants.addItem(participants[v]);
            });
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }
        });
    }
  }
}
