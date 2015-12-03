'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      main_app_js: {
        options: {
          separator: ';',
          banner: '/*! app.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          '.grunt-cache/app.js': [
            "src/require.js",
            "src/lib/**/*.js",
            "src/controller/**/*.js",
            "src/index.js"
          ]
        }
      }

    },

    uglify: {
      appjs: {
        options: {
          mangle: true,
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
        },
        files: {
          '.grunt-cache/app.min.js': ['.grunt-cache/app.js']
        }
      }
    },

    copy: {
      //options: {},
      main: {
        files: {
          './dist/index.js': ['.grunt-cache/app.min.js']
        }
      }
    },

    clean: {
      all: ['.grunt-cache']
    },

    watch: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      tasks: ['concat', 'uglify','copy', 'clean']
    }

  });

  grunt.registerTask('start', ['concat', 'uglify',  'copy', 'clean', 'watch'])
  grunt.registerTask('build', ['concat', 'uglify',  'copy', 'clean'])

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

};