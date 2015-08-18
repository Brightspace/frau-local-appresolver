import appresolver from '../lib/appresolver';
import corsProxy from 'superagent-d2l-cors-proxy';
import request from 'request';
import chai from 'chai';

let expect = chai.expect;

let APP_CLASS = 'urn:d2l:fra:class:some-class',
	DEFAULT_PORT = 3000;

describe('appresolver', () => {

	describe('defaults', () => {

		it('should have _opts property', () => {
			expect(appresolver(APP_CLASS)._opts)
				.to.be.defined;
		});

		it('class', () => {
			expect(appresolver(APP_CLASS)._opts.appClass)
				.to.be.equal(APP_CLASS);
		});

		it('should fail when no appClass is specified', () => {
			expect(() => {
				appresolver();
			}).to.throw(Error, 'appClass is a required argument for LocalAppResolver.');
		});

		it('hostname', () => {
			expect(appresolver(APP_CLASS)._opts.hostname)
				.to.be.equal(require('os').hostname().replace('.local',''));
		});

		it('port', () => {
			expect(appresolver(APP_CLASS)._opts.port)
				.to.be.equal(DEFAULT_PORT);
		});

		it('dist', () => {
			expect(appresolver(APP_CLASS)._opts.dist)
				.to.be.equal('dist');
		});

		it('appconfig', () => {
			expect(appresolver(APP_CLASS)._opts.configFile)
				.to.be.equal('appconfig.json');
		});

	});

	describe('hostname', () => {

		it('should strip ".local" domain from OSX hostname', () => {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.local' }).getUrl())
				.to.be.equal(`http://somehost:${DEFAULT_PORT}/app/`);
		});

	});

	describe('getUrl', () => {

		it('should return expected url', () => {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111 }).getUrl())
				.to.be.equal('http://somehost.com:11111/app/');
		});

	});

	describe('getConfigUrl', () => {

		it('should return expected url', () => {
			expect(appresolver(APP_CLASS, { hostname: 'somehost.com', port: 11111, configFile: 'someconf.js' }).getConfigUrl())
				.to.be.equal('http://somehost.com:11111/app/someconf.js');
		});

	});

	describe('host', () => {

		var resolver = appresolver(APP_CLASS, { dist: 'test/testDist', hostname: 'localhost' });
		resolver.host();

		it('should serve resolution', (cb) => {
			let url = `http://localhost:${DEFAULT_PORT}/resolve/${encodeURIComponent(APP_CLASS)}`;
			let expectedUrl = `http://localhost:${DEFAULT_PORT}/app/appconfig.json`;
			request.get(url, (error, response, body) => {
				if(error) {
					cb(error);
				} else if ( response.statusCode != 200 ) {
					cb(response.statusCode);
				} else if ( JSON.parse(body).url != expectedUrl ) {
					cb(JSON.parse(body));
				} else {
					cb();
				}
			});
		});

		it('should not serve resolution when trying to resolve app-class that is not being hosted', (cb) => {
			let url = `http://localhost:${DEFAULT_PORT}/resolve/some-other-app-class`;
			request.get(url, (error, response, body) => {
				if(error) {
					cb(error);
				} else if ( response.statusCode != 404 ) {
					cb(response.statusCode);
				} else {
					cb();
				}
			});
		});

		it('should serve static files', (cb) => {
			let url = `http://localhost:${DEFAULT_PORT}/app/staticFileToBeServed.txt`;
			request.get(url, (error, response, body) => {
				if(error) {
					cb(error);
				} else if ( response.statusCode != 200 ) {
					cb(response);
				} else if ( body != 'some simple contents' ) {
					cb(body);
				} else {
					cb();
				}
			});
		});

		it('should serve CORS proxy', (cb) => {
			let url = `http://localhost:${DEFAULT_PORT}${corsProxy.getProxyDefaultLocation()}`;
			request.get(url, (err, res, body) => {
				if(err)
					return cb(err);
				if(res.statusCode !== 200)
					return cb(res);
				cb();
			});
		});

	});

});
