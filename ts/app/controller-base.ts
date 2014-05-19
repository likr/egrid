module egrid.app {
  /**
   * @abstract
   */
  export class ControllerBase {
    public constructor(public $rootScope, public $timeout, public $filter, public alertLifeSpan) {
    }

    public showAlert(key: string, type: string = 'success') {
      this.$rootScope.alerts[0] = { type: type, msg: this.$filter('translate')(key) };

      this.$timeout(() => {
        this.$rootScope.alerts.pop();
      }, this.alertLifeSpan);
    }
  }
}
