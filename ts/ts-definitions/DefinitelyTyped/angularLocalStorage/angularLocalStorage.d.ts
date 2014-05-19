/// <reference path="../angularjs/angular.d.ts" />

declare var angular: ng.IAngularStatic;

declare module angularLocalStorage {
  interface IStorageService {
    bind($scope: ng.IScope, key: string, opts?: Object): any;
    clearAll(): void;
    get(key: string): any;
    remove(key: string): boolean;
    set(key: string, value: any): any;
  }
}
