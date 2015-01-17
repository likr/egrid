/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../ts-definitions/DefinitelyTyped/angular-ui/angular-ui-router.d.ts"/>
/// <reference path="../../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../../lib/egrid-client.d.ts"/>
/// <reference path="../../../lib/egrid-core.d.ts"/>

class AnalysisSynonymController {
  public static $inject: string[] = [
    '$q',
    'showAlert',
    'grid'
  ];

  private constructs: any[];
  private groups: any[] = [];
  private unsorted: (node: any, index: number) => boolean;

  constructor(private $q, private showAlert, private gridData) {
    this.constructs = this.gridData.nodes.map((node, i) => {
      return {
        index: i,
        group: null,
        node: node
      };
    });

    this.groups = (gridData.groups || []).map((group, i) => {
      return {
        index: i,
        label: group.label,
        constructs: group.children.map(u => {
          this.constructs[u].group = i;
          return this.constructs[u];
        })
      };
    });

    if (this.groups.length === 0) {
      this.addGroup();
    }

    this.unsorted = (construct: any) : boolean => {
      return construct.group === null;
    };
  }

  addGroup() : void {
    this.groups.push({
      index: this.groups.length,
      label: '',
      constructs: []
    });
  }

  onDrop(event: any, ui: any, groupIndex: number) : void {
    var synonym = (<any>this).synonym;
    var construct = synonym.constructs[(<any>this).target];
    construct.index = (<any>this).target;
    if (construct.group !== null) {
      var previousGroup = synonym.groups[construct.group];
      previousGroup.constructs = previousGroup.constructs.filter(c => {
        return c.index !== construct.index;
      });
    }
    if (groupIndex === null) {
      construct.group = null;
    } else {
      synonym.groups[groupIndex].constructs.push(construct);
      construct.group = groupIndex;
    }
  }

  save() : void {
    this.gridData.groups = this.groups.map(group => {
      return {
        label: group.label,
        children: group.constructs.map(construct => construct.index)
      };
    });
    this.$q.when(this.gridData.save())
      .then(() => {
        this.showAlert('MESSAGES.UPDATED');
      }, (...reasons: any[]) => {
        var k: string = reasons[0].status === 401
          ? 'MESSAGES.NOT_AUTHENTICATED'
          : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';
        this.showAlert(k, 'danger');
      });
  }
}

angular.module('egrid')
  .config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    $stateProvider
      .state('egrid.projects.get.analyses.get.synonym', {
        url: '/synonym',
        views: {
          'tab-content@egrid.projects.get.analyses.get': {
            controller: 'AnalysisSynonymController as synonym',
            templateUrl: '/partials/projects/get/analyses/get/synonym.html',
          },
        },
      })
  }])
  .controller('AnalysisSynonymController', AnalysisSynonymController);
