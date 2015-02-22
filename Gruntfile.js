/*
 * grunt-docker-io
 * https://github.com/drGrove/grunt-docker-io
 *
 * Copyright (c) 2015 Danny Grove
 * Licensed under the AGPL license.
 */

'use strict';

module.exports = function(grunt) {
  var pkg = require('./package.json')
  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
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
          username: 'drgrove',
          tag: ['test', 'latest'],
          push: false
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
      , commitFiles: ['-a']
      , updateConfigs: ['pkg']
      , createTage: true
      , push: true
      , pushTo: 'origin'
      , gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      , globalReplace: false
      }
    },
    release:
    { options:
      { bump: false
      , commitMessage: 'Release <%= pkg.version %>'
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
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('publish', function(target){
    target = target || 'patch'
    grunt.task.run
    ( [ 'bump:' + target
      , 'release'
      ]
    )
  })
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'docker_io', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
