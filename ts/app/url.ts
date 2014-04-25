/// <reference path="../lib/egrid-client.d.ts"/>

module egrid.app {
  export class Url {
    static participantUrlBase = '/projects/:projectId/participants/:participantId';
    static participantGridUrlBase = '/projects/:projectId/participants/:participantId/grid';
    static projectUrlBase = '/projects/:projectId';
    static projectGridUrlBase = '/projects/:projectKey/grid/:projectGridKey';
    static projectGridListUrlBase = '/projects/:projectKey/grid';
    static projectListUrlBase = '/projects';
    static semProjectUrlBase = '/projects/:projectId/sem-projects/:semProjectId';

    static participantUrl(projectKey : string, participantKey : string, action?: string) : string;
    static participantUrl(participant : model.Participant, action?: string) : string;
    static participantUrl(arg : any, participantKey? : string, action?: string) : string{
      var projectKey;
      if (typeof participantKey !== 'string') {
        projectKey = arg.projectKey;
        participantKey = arg.key();
      } else {
        projectKey = arg;
      }
      return action
        ? '/projects/' + projectKey + '/participants/' + participantKey + '/' + action
        : '/projects/' + projectKey + '/participants/' + participantKey;
    }

    static participantGridUrl(projectKey : string, participantKey : string) : string;
    static participantGridUrl(participant : model.Participant) : string;
    static participantGridUrl(arg : any, participantKey? : string) : string{
      return Url.participantUrl(arg, participantKey) + '/grid';
    }

    static projectListUrl() : string {
      return Url.projectListUrlBase;
    }

    static projectUrl(projectKey : string, action?: string) : string;
    static projectUrl(project : model.Project, action?: string) : string;
    static projectUrl(project : any, action?: string) : string {
      var result: string;

      if (project instanceof model.Project) {
        result = '/projects/' + project.key();
      } else {
        result = '/projects/' + project;
      }

      return action ? result + '/' + action : result;
    }

    static projectGridUrl(projectKey : string, projectGridKey : string) : string;
    static projectGridUrl(projectGrid : model.ProjectGrid) : string;
    static projectGridUrl(arg : any, projectGridKey? : string) : string {
      var projectKey;
      if (projectGridKey === undefined) {
        projectKey = arg.projectKey;
        projectGridKey = arg.key;
      } else {
        projectKey = arg;
      }
      return '/projects/' + projectKey + '/grid/' + projectGridKey;
    }

    static semProjectUrl(semProject : model.SemProject, action?: string) : string {
      return action
        ? '/projects/' + semProject.projectKey + '/sem-projects/' + semProject.key + '/' + action
        : '/projects/' + semProject.projectKey + '/sem-projects/' + semProject.key;
    }
  }
}
