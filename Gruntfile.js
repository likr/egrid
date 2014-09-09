module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: {
      generate: {
        dest: 'static/files.appcache',
        options: {
          basePath: 'static',
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
      egrid: {
        cwd: 'static',
        dest: 'static/scripts/templates.js',
        options: {
          prefix: '/',
        },
        src: 'partials/**/*.html'
      }
    },
    typescript: {
      base: {
        src: ['ts/app/main.ts'],
        dest: 'static/scripts/collaboegm.js',
        options: {
          sourceMap: false,
          target: 'es5',
        }
      }
    },
    watch: {
      scripts: {
        files: ['ts/**/*.ts'],
        tasks: ['typescript', 'manifest'],
      },
      templates: {
        files: ['static/index.html', 'static/partials/**/*.html'],
        tasks: ['ngtemplates','manifest'],
      },
      statics: {
        files: ['static/scripts/**/*.js', 'styles/*.css'],
        tasks: ['manifest']
      }
    },
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('compile', ['ngtemplates', 'typescript', 'manifest']);
};
