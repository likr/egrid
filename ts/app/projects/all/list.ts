/// <reference path="../../../../typings/egrid-client/egrid-client.d.ts"/>
/// <reference path="../../pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public static $inject : string[] = ['projects'];

    constructor(private projects : model.Project[]) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;
    }
  }
}
