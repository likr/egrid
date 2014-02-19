/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectListController {
    list : model.SemProject[];

    constructor($q, $stateParams, storage) {
      var projectId = $stateParams.projectId;

      $q.when(model.SemProject.query(projectId))
        .then((semProjects : model.SemProject[]) => {
          storage.set('sem', semProjects.map(JSON.stringify));
        })
        .finally(() => {
          this.list = storage.get('sem').map(model.SemProject.parse);
        })
    }
  }
}
