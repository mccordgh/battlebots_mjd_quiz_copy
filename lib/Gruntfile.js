module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      '../dist/app.js': ['../js/Main.js'],
      options: {
        browserifyOptions: {
          paths: ["./node_modules"]
        }
      }
    },
    jshint: {
      files: ['../js/**/*.js'],
      options: {
        predef: ["document", "console", "event", "alert", "module", "require", "window" ],
        esnext: true,
        globalstrict: true,
        globals: {}
      }
    },
    sass: {
      dist: {
        files: {
// target: source
          '../css/styles.css': '../sass/styles.sass'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../js/**/*.js'],
        tasks: ['jshint']
      },
      sass: {
        files: ['../sass/**/*.sass'],
        tasks: ['sass']
      },
      browserify: {
        files: ['../js/*.js'],
        tasks: ["browserify"]
      }
   }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'sass', 'browserify', 'watch']);
};