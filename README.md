# grunt-docker-io

> Build and Push Docker Images

[![NPM](https://nodei.co/npm/grunt-docker-io.png?downloads=true&downloadRank=true)](https://nodei.co/npm/grunt-docker-io)


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-docker-io --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-docker-io');
```

## The "docker_io" task

### Overview
In your project's Gruntfile, add a section named `docker_io` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  docker_io: {
    options: {
      dockerFileLocation: '.',
      buildName: 'dockerIO',
      tag: 'latest',
      pushLocation: 'https://hub.docker.io',
      username: 'drgrove',
      push: true,
      force: true
    }
  },
});
```

### Options

#### options.dockerFileLocation
Type: `String`
Default value: `'.'`


A string value that gives the location of the docker file relative to project root.

#### options.buildName
Type: `String`
Default value: `''`

A string value that is used to create the image name

#### options.tag
Type: `String`
Default value: `'latest'`

A string value for setting the images tag

#### options.pushLocation
Type: `String`
Default value: `'https://hub.docker.io'`

A string value for the location where you'd like to push for docker image

#### options.username
Type: `String`
Default value: `process.env.USER`
Required: `true`

Your Registry username.

#### options.push 
Type: `Boolean`
Default value: `true`

Push the image to a Docker Registry

#### options.force
Type: `Boolean`
Default value: `false`

Force the tag creation

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  docker_io: {
    options: {
      dockerFileLocation: '.',
      buildName: '',
      tag: 'latest',
      pushLocation: 'https://hub.docker.io',
      username: process.env.USER, // Current logged in user
      push: true,
      force: false
    }
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - Initial Release (Ability to Build and Push Dockerfiles)

