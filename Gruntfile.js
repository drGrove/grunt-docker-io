/*
 * grunt-docker-io
 * https://github.com/drGrove/grunt-docker-io
 *
 * Copyright (c) 2015 Danny Grove
 * Licensed under the AGPL license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    version: require('./package.json').version,
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    docker_io: {
      default_options: {
        options: {
          dockerFileLocation: 'test',
          buildName: 'node-test',
          username: 'drgrove'
        },
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },
    bump:
    { options:
      { files: ['package.json']
      , commit: true
      , commitFiles: ['package.json']
      , updateConfigs: ['version']
      , createTage: true
      , push: true
      , pushTo: 'origin'
      , gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      , globalReplace: false
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-bump');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'docker_io', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
