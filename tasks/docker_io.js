/*
 * grunt-docker-io
 * https://github.com/drGrove/grunt-docker-io
 *
 * Copyright (c) 2015 Danny Grove
 * Licensed under the AGPL license.
 */

'use strict';

var spawn = require('child_process').spawn


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('docker_io', 'Build and Push Docker Images', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var DOCKER_HUB_URL = "http://hub.docker.io"
    var REQUIRES_LOGIN = "Please login prior to push:"
    var opts = this.options({
      dockerFileLocation: '.',
      buildName: '',
      tag: 'latest',
      pushLocation: DOCKER_HUB_URL,
      username: process.env.USER,
      push: true,
      force: false
    });

    var done = this.async();
    var queue = [];
    var next = function() {
      if(!queue.length) {
        return done()
      }
      queue.shift()();
    }

    var runIf = function(condition, behavior){
      if(condition) {
        queue.push(behavior)
      }
    }

    // Check that user is logged in
    runIf(true, function(){
      var loginOpts = ['login']
      if(opts.pushLocation !== DOCKER_HUB_URL) {
        loginOpts.push(opts.pushLocation)
      }

      var dockerLogin = spawn('docker', loginOpts)
      dockerLogin.stdout.on('data', function(data){
        data = data || ''
        var usernameRegex = /\(.*\)/
        if(usernameRegex.exec(data).length > 0) {
          if(usernameRegex.exec(data)[0] !== '(' + opts.username + ')'){
            grunt.fatal('Please Login First')
          }
          next()
        } else {
          grunt.fatal('Please login to the docker registry - ' + opts.pushLocation)
        }
      })
    })

    runIf
    ( opts.dockerFileLocation !== ''
      && opts.buildName !== ''
    , function(){
        var buildOpts = []
        if(opts.pushLocation === DOCKER_HUB_URL) {
          opts.buildName = opts.username + '/' + opts.buildName
        } else {
          opts.buildName = opts.pushLocation + '/' + opts.buildName
        }
        if(opts.tag !== '' || opts.tag !== 'latest') {
          opts.buildName += ':' + opts.tag
        }
        buildOpts.push('build')
        if(opts.force) {
          buildOpts.push('-f')
        }
        buildOpts.push('-t')
        buildOpts.push(opts.buildName)
        buildOpts.push(opts.dockerFileLocation)
        var buildDocker = spawn('docker', buildOpts)
        buildDocker.stdout.on('data', function(data){
          grunt.log.ok(data)
        })
        buildDocker.stderr.on('data', function(data){
          grunt.log.error(data)
        })
        buildDocker.on('exit', function(code){
          if(code !== 0) {
            grunt.fatal('Could not build docker image')
          }
          next()
        })
      }
    )

    runIf(opts.push, function(){
      var pushOpts = []
      pushOpts.push('push')
      pushOpts.push(opts.buildName)
      var dockerPush = spawn('docker', pushOpts)
      dockerPush.stdout.on('data', function(data){
        if(data === REQUIRES_LOGIN) {
          grunt.fatal('You must first login ')
        }
        grunt.log.ok(data)
      })
      dockerPush.stderr.on('data', function(data){
        grunt.log.error(data)
      })
      dockerPush.on('exit', function(code){
        if(code !== 0) {
          grunt.fatal('Could not push docker image ' + opts.buildName)
        }
        next()
      })
    })

    next()
  });
};
