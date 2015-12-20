'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    concat: require('./grunt/config/concat'),
    jst: require('./grunt/config/jst'),
    uglify: require('./grunt/config/uglify'),
    less: require('./grunt/config/less'),
    sass: require('./grunt/config/sass'),
    cssmin: require('./grunt/config/cssmin'),
    copy: require('./grunt/config/copy'),
    clean: require('./grunt/config/clean'),
    watch: require('./grunt/config/watch')

  });

  require('./grunt/tasks')(grunt)

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jst');

};