'use strict';

const os = require('os'),
	dns = require('dns'),
	deasync = require('deasync');

const CORS_PROXY_HTML = `
<!DOCTYPE html>
<html>
	<head>
		<title>CORS proxy</title>
	</head>
	<body>
		<script src="https://s.brightspace.com/lib/superagent/1.2.0/superagent.min.js"></script>
		<script>

			function makeUrlLocal(url) {

				var url = url.replace(/^[a-zA-Z]+:/, '');
				url = url.replace(/^//[^/]+/, '');
				url = url.replace(/^//, '');

				var localUrl = window.location.protocol + '//' + window.location.host + '/' + url;
				return localUrl;

			}

			window.addEventListener('message', function(evt) {
				var data = JSON.parse(evt.data);
				var localUrl = makeUrlLocal(data.url);
				superagent(data.method, localUrl)
					.query(data.query && data.query.join('&'))
					.timeout(data.timeout)
					.send(data.data)
					.set(data.header)
					.end(function(err, res) {
						parent.postMessage(
							JSON.stringify({
								id: data.id,
								err: err,
								res: res
							}),
							'*'
						);
					});
			});

			if(window.parent !== window) {
				window.parent.postMessage(
					JSON.stringify({type: 'ready'}),
					'*'
				);
			}

		</script>
	</body>
</html>
`;
const CORS_PROXY_LOCATION = '/cors-proxy.html';

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
		CORS_PROXY_LOCATION,
		function(req, res) {
			res.send(CORS_PROXY_HTML);
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

LocalAppRegistry.prototype._getProxyDefaultLocation = function() {
	return CORS_PROXY_LOCATION;
};

module.exports = function(appClass, opts) {
	return new LocalAppRegistry(appClass, opts);
};
