module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: {
      generate: {
        dest: 'static/files.appcache',
        options: {
          basePath: 'static',
          cache: ['api/users'],
          hash: true,
          master: ['static/index.html'],
          timestamp: true,
        },
        src: [
          'bower_components/angular/angular.min.js',
          'bower_components/angular-ui-router/release/angular-ui-router.min.js',
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.*',
          'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min.js',
          'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
          'bower_components/angular-translate/angular-translate.min.js',
          'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
          'bower_components/d3/d3.min.js',
          'locations/*.json',
          'partials/*.html',
          'scripts/**/*.js',
          'styles/*.css',
        ],
      },
    },
    ngtemplates: {
      collaboegm: {
        cwd: 'static',
        dest: 'static/scripts/templates.js',
        options: {
          prefix: '/',
        },
        src: 'partials/**/*.html'
      }
    },
    ts: {
      dev: {
        out: 'static/scripts/collaboegm.js',
        src: ['ts/app/app.ts'],
        options: {
          sourceMap: false,
          target: 'es5',
        },
      },
      prod: {
        out: 'static/scripts/collaboegm.min.js',
        src: ['ts/app/app.ts'],
        options: {
          removeComments: true,
          sourceMap: false,
          target: 'es5',
        },
      }
    },
    watch: {
      scripts: {
        files: ['ts/**/*.ts'],
        tasks: ['ts:dev', 'manifest'],
      },
      templates: {
        files: ['static/index.html', 'static/partials/**/*.html'],
        tasks: ['ngtemplates','manifest'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['ngtemplates', 'ts:prod', 'manifest']);
};
