# frau-local-appresolver

[![NPM version][npm-image]][npm-url]

A free-range-app utility for resolving locally hosted apps.

## Installation

Install from NPM:
```shell
npm install frau-local-appresolver
```

## Usage

### From CLI

The FRAU app resolver can be run either directly on the console CLI (assuming dependencies are installed), or specified as a script in `package.json`.

Launching the local app resolver can be as simple as:

```sh
frau-local-appresolver --appclass|-c urn:d2l:fra:class:some-app
```

However additional options (described below) can be configured:

```sh
frau-local-appresolver --appclass|-c urn:d2l:fra:class:some-app
                       --configfile|-f appconfig.json
                       --hostname|-h acme.com
                       --port|-p 3000
                       --publicEndpoint|-e https://xyz.ngrok.io
                       --dist|-d dist
                       --baseRoute|-b /app
```

```json
"scripts": {
  "resolver": "frau-local-appresolver"
},
"config": {
  "frauLocalAppResolver": {
    "appClass": "urn:d2l:fra:class:some-app",
    "configFile": "appconfig.json",
    "hostname": "acme.com",
    "port": "3000",
    "publicEndpoint": "https://xyz.ngrok.io",
    "dist": "dist",
    "baseRoute": "/app"
   }
}
```

### From JavaScript

```javascript
var appResolver = require('frau-local-appresolver').resolver;

// simply provide required appClass
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
  - `hostname` - The hostname (or IP) to listen on. By default, the hostname of the operating system is used.  You should not need to change this.
  - `publicEndpoint` - If provided overrides the protocol (http) hostname and port for endpoint resolution
  - `configFile` - The name of the app config file.  By default, `appconfig.json` is used.  You should not need to change this.
  - `baseRoute` - Specifies the base route to be included in urls.  By default, `/app` is used.  Setting this to different values (e.g. `''`) will allow you to use tools such as `es-dev-server` where you want the endpoint hosted at `http://localhost:3000/index.html` instead of `http://localhost:3000/app/index.html`.

## Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.

## Contributing

Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[npm-url]: https://www.npmjs.org/package/frau-local-appresolver
[npm-image]: https://img.shields.io/npm/v/frau-local-appresolver.svg
