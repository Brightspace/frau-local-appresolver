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

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)

## Contributing

Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[npm-url]: https://www.npmjs.org/package/frau-local-appresolver
[npm-image]: https://img.shields.io/npm/v/frau-local-appresolver.svg
