'use strict';

const appresolver = require('../src/appresolver'),
	corsProxy = require('superagent-d2l-cors-proxy'),
	request = require('request'),
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
			request.get(url, function(error, response, body) {
				if (error) {
					cb(error);
				} else if (response.statusCode !== 200) {
					cb(response.statusCode);
				} else if (JSON.parse(body).url !== expectedUrl) {
					cb(JSON.parse(body));
				} else {
					cb();
				}
			});
		});

		it('should not serve resolution when trying to resolve app-class that is not being hosted', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + '/resolve/some-other-app-class';
			request.get(url, function(error, response) {
				if (error) {
					cb(error);
				} else if (response.statusCode !== 404) {
					cb(response.statusCode);
				} else {
					cb();
				}
			});
		});

		it('should serve static files', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + '/app/staticFileToBeServed.txt';
			request.get(url, function(error, response, body) {
				if (error) {
					cb(error);
				} else if (response.statusCode !== 200) {
					cb(response);
				} else if (body !== 'some simple contents') {
					cb(body);
				} else {
					cb();
				}
			});
		});

		it('should serve CORS proxy', function(cb) {
			const url = 'http://localhost:' + DEFAULT_PORT + corsProxy.getProxyDefaultLocation();
			request.get(url, function(err, res) {
				if (err)
					return cb(err);
				if (res.statusCode !== 200)
					return cb(res);
				cb();
			});
		});

	});

});
