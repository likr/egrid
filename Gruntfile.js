module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: 'app/static',
          layout: function(type) {
            var renamedType = type;
            if (type === 'js' || type === 'map') {
              renamedType = 'scripts';
            } else if (type === 'css') {
              renamedType = 'styles';
            }
            return renamedType;
          }
        }
      }
    },
    manifest: {
      generate: {
        dest: 'app/static/files.appcache',
        options: {
          basePath: 'app/static',
          hash: true,
          master: ['index.html'],
          timestamp: true,
        },
        src: [
          'dict/*',
          'locations/*.json',
          'scripts/**/*.js',
          'styles/**/*.css',
          'fonts/*'
        ],
      },
    },
    ngtemplates: {
      egrid: {
        cwd: '.',
        dest: 'app/static/scripts/templates.js',
        options: {
          prefix: '/',
        },
        src: 'partials/**/*.html'
      }
    },
    typescript: {
      base: {
        src: [
          'ts/app/main.ts',
          'ts/app/controllers/**/*.ts',
          'ts/app/directives/**/*.ts',
          'ts/app/filters/**/*.ts',
          'ts/app/services/**/*.ts',
        ],
        dest: 'app/static/scripts/collaboegm.js',
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
        files: ['app/static/index.html', 'partials/**/*.html'],
        tasks: ['ngtemplates','manifest'],
      },
      statics: {
        files: ['app/static/scripts/**/*.js', 'app/static/styles/*.css', 'app/static/locations/*.json'],
        tasks: ['manifest']
      }
    },
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['ngtemplates', 'typescript', 'manifest']);
};
