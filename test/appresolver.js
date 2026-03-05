'use strict';

const appresolver = require('../src/appresolver'),
	chai = require('chai');

const expect = chai.expect;

const APP_CLASS = 'urn:d2l:fra:class:some-class',
	DEFAULT_PORT = 3000;

describe('appresolver', function() {

	describe('defaults', function() {

		it('should have _opts property', function() {
			expect(appresolver(APP_CLASS)._opts)
				.to.not.be.undefined;
		});

		it('class', function() {
			expect(appresolver(APP_CLASS)._opts.appClass)
				.to.be.equal(APP_CLASS);
		});

		it('should fail when no appClass is specified', function() {
			expect(function() {
				appresolver();
			}).to.throw(Error, 'appClass is a required argument for LocalAppResolver.');
		});

		it('port', function() {
			expect(appresolver(APP_CLASS)._opts.port)
				.to.be.equal(DEFAULT_PORT);
		});

		it('dist', function() {
			expect(appresolver(APP_CLASS)._opts.dist)
				.to.be.equal('dist');
		});

		it('appconfig', function() {
			expect(appresolver(APP_CLASS)._opts.configFile)
				.to.be.equal('appconfig.json');
		});

		it('baseRoute', function() {
			expect(appresolver(APP_CLASS)._opts.baseRoute)
				.to.be.equal('/app');
		});

	});

	describe('hostname', function() {

		it('should strip ".local" domain from OSX hostname', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.local' }).getUrl())
				.to.be.equal('http://somehost:' + DEFAULT_PORT + '/app/');
		});

		it('should strip ".local" domain from OSX hostname - with baseRoute', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.local', baseRoute: '' }).getUrl())
				.to.be.equal('http://somehost:' + DEFAULT_PORT + '/');
		});

	});

	describe('getUrl', function() {

		it('should return expected url', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111 }).getUrl())
				.to.be.equal('http://somehost.com:11111/app/');
		});

		it('should return expected url - with baseRoute', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111, baseRoute: '' }).getUrl())
				.to.be.equal('http://somehost.com:11111/');
		});

	});

	describe('getConfigUrl', function() {

		it('should return expected url', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111, configFile: 'someconf.js' }).getConfigUrl())
				.to.be.equal('http://somehost.com:11111/app/someconf.js');
		});

		it('should return expected url - with baseRoute', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111, configFile: 'someconf.js', baseRoute: '' }).getConfigUrl())
				.to.be.equal('http://somehost.com:11111/someconf.js');
		});

	});

	describe('getPublicEndpoint', function() {

		it('should override the resolved url', function() {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111, configFile: 'someconf.js', publicEndpoint: 'https://otherhost.com' }).getConfigUrl())
				.to.be.equal('https://otherhost.com/app/someconf.js');
		});

	});

	describe('host', function() {

		let resolver;

		before(() => {
			resolver = appresolver(APP_CLASS, { dist: 'test/testDist', hostname: 'localhost' });
			resolver.host();
		});

		after(() => {
			resolver.close();
		});

		it('should serve resolution', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + '/resolve/' + encodeURIComponent(APP_CLASS);
			const expectedUrl = 'http://localhost:' + DEFAULT_PORT + '/app/appconfig.json';
			fetch(url).then(res => {
				if (!res.ok) return cb(res.status);
				return res.json();
			}).then(json => {
				if (json.url !== expectedUrl) {
					cb(json);
				} else {
					cb();
				}
			});
		});

		it('should not serve resolution when trying to resolve app-class that is not being hosted', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + '/resolve/some-other-app-class';
			fetch(url).then(res => {
				if (res.status !== 404) {
					cb(res.status);
				} else {
					cb();
				}
			});
		});

		it('should serve static files', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + '/app/staticFileToBeServed.txt';
			fetch(url).then(res => {
				if (!res.ok) return cb(res.status);
				return res.text();
			}).then(body => {
				if (body !== 'some simple contents') {
					cb(body);
				} else {
					cb();
				}
			});
		});

		it('should serve CORS proxy', function(cb) {
			const url = `http://localhost:${DEFAULT_PORT}${resolver._getProxyDefaultLocation()}`;
			fetch(url).then(res => {
				if (!res.ok) {
					return cb(res.status);
				} else {
					cb();
				}
			});
		});

	});

});
