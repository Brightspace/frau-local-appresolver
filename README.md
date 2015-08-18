# frau-local-appresolver

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dependencies-image]][dependencies-url]

A free-range-app utility for resolving locally hosted apps.

## Installation

Install from NPM:
```shell
npm install frau-local-appresolver
```

## Usage

### From CLI

```javascript
localappresolver -c urn:d2l:fra:class:some-app

localappresolver -c urn:d2l:fra:class:some-app -f appconfig.json -h acme.com -p 3000 -d dist
```

See below for parameter explanation.

### From JavaScript

```javascript
var appResolver = require('frau-local-appresolver');

// simply provide requrie appClass
appResolver = appResolver(appClass);

// alternatively override default options
appResolver = appResolver(appClass, options);

// host the app resolver
appResolver.host();

// get where the app content is hosted
var target = appResolver.getUrl();
```

**Parameters**:

- `appClass` (required) - The app class to resolve.
- `options` (optional) - An object containing:
  - `dist` - The directory containing the app files to serve.  By default, the `dist` directory is used.
  - `port` - The port to listen on.  By default, port `3000` is used, which is the port that the LMS expects it on.
  - `hostname` - The hostname (or IP) to listen on. By default, `localhost` is used.  You should not need to change this.
  - `configFile` - The name of the app config file.  By default, `appconfig.json` is used.  You should not need to change this.


[npm-url]: https://www.npmjs.org/package/frau-local-appresolver
[npm-image]: https://img.shields.io/npm/v/frau-local-appresolver.svg
[ci-url]: https://travis-ci.org/Brightspace/frau-local-appresolver
[ci-image]: https://img.shields.io/travis-ci/Brightspace/frau-local-appresolver.svg
[coverage-url]: https://coveralls.io/r/Brightspace/frau-local-appresolver?branch=master
[coverage-image]: https://img.shields.io/coveralls/Brightspace/frau-local-appresolver.svg
[dependencies-url]: https://david-dm.org/brightspace/frau-local-appresolver
[dependencies-image]: https://img.shields.io/david/Brightspace/frau-local-appresolver.svg
