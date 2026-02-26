'use strict';

const corsProxy = require('superagent-d2l-cors-proxy'),
	os = require('os'),
	dns = require('dns'),
	deasync = require('deasync');

const getFQDN = deasync(function(cb) {
	const uqdn = os.hostname();
	dns.lookup(uqdn, { hints: dns.ADDRCONFIG }, function(err, ip) {
		if (err) {
			return cb(err);
		}
		dns.lookupService(ip, 0, function(err, fqdn) {
			if (err) {
				return cb(err);
			}
			cb(null, fqdn);
		});
	});
});

function getHostname(opts) {
	let hostname = opts.hostname || getFQDN() || os.hostname();
	if (hostname.indexOf('.local', hostname.length - 6) !== -1) {
		hostname = hostname.substr(0, hostname.length - 6);
	}
	return hostname;
}

function LocalAppRegistry(appClass, opts) {

	if (!appClass) {
		throw new Error('appClass is a required argument for LocalAppResolver.');
	}

	opts = opts || {};
	opts.appClass = appClass;
	opts.hostname = getHostname(opts);
	opts.port = opts.port || 3000;
	opts.dist = opts.dist || 'dist';
	opts.configFile = opts.configFile || 'appconfig.json';
	opts.baseRoute = opts.baseRoute !== undefined ? opts.baseRoute : '/app';

	this._opts = opts;
}

LocalAppRegistry.prototype.host = function() {

	const self = this;
	const app = require('express')();
	const cors = require('cors');
	const serveStatic = require('serve-static');

	app.use(cors());

	app.use(this._opts.baseRoute, serveStatic(self._opts.dist));

	const encodedAppClass = encodeURIComponent(self._opts.appClass);
	app.get('/resolve/' + encodedAppClass, function(req, res) {
		res.json({ url: self.getConfigUrl() });
	});

	app.get(
		corsProxy.getProxyDefaultLocation(),
		function(req, res) {
			res.sendFile(corsProxy.getProxyFilePath());
		}
	);

	return new Promise(function(resolve, reject) {
		self._server = app.listen(self._opts.port, function() {
			resolve();
		});
		self._server.on('error', function(err) {
			reject(err);
		});
	});

};

LocalAppRegistry.prototype.close = function() {
	if (this._server) {
		this._server.close();
	}
};

LocalAppRegistry.prototype.getUrl = function() {
	const base = this._opts.publicEndpoint ||
		('http://' + this._opts.hostname + ':' + this._opts.port);
	return base + this._opts.baseRoute + '/';
};

LocalAppRegistry.prototype.getConfigUrl = function() {
	return this.getUrl() + this._opts.configFile;
};

module.exports = function(appClass, opts) {
	return new LocalAppRegistry(appClass, opts);
};
