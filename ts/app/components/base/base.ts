/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../lib/angular-new-router.d.ts"/>

module egrid.app {
  class AuthorizationError {
    constructor(public loginUrl: string) {
    }
  }

  interface Alert {
  }

  interface User {
    location: string;
  }

  interface Auth {
    logedIn: boolean;
    loginUrl: string;
    logoutUrl: string;
  }

  class BaseController {
    public alerts: Alert[] = [];
    public auth: Auth;
    public user: User;

    public static $routeConfig: Route[] = [
      {
        path: '/projects/all',
        as: 'projectAll',
        components: {
          content: 'projectAll'
        }
      },
      {
        path: '/projects/:projectKey',
        as: 'projectGet',
        components: {
          content: 'projectGet'
        }
      },
      {
        path: '/projects/:projectKey/participants/:participantKey',
        as: 'participantGet',
        components: {
          content: 'participantGet'
        }
      },
      {
        path: '/projects/:projectKey/analyses/:analysisKey',
        as: 'analysisGet',
        components: {
          content: 'analysisGet'
        }
      },
      {
        path: '/about',
        components: {
          content: 'about'
        }
      },
      {
        path: '/help',
        components: {
          content: 'help'
        }
      },
      {
        path: '/install',
        components: {
          content: 'install'
        }
      }
    ];

    constructor(private $q, private $http, private $translate) {
    }

    canActivate() {
      var deferred = this.$q.defer();
      var destUrl = '/';
      this.$http.get('/api/public/auth?dest_url=' + encodeURIComponent(destUrl))
        .success((data: Auth) => {
          if (data.logedIn) {
            this.auth = data;
            deferred.resolve(data);
          } else {
            deferred.reject(new AuthorizationError(data.loginUrl));
          }
        })
        .error(() => {
          deferred.reject();
        });
      return deferred.promise;
    }

    activate() {
      this.$http.get('/api/users')
        .success(user => {
          this.user = user;
          this.$translate(this.user.location);
        });
    }

    changeLanguage(langKey: string): void {
      this.$translate.use(langKey);
      this.$http({
        method: "POST",
        url: '/api/users',
        data: {
          location: langKey,
        },
      });
    }
  }

  angular.module('egrid')
    .controller('BaseController', BaseController);
}
