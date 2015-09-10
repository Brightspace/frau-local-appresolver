'use strict';

module.exports = {
	getAppClass: function(argv) {
		return argv.appclass || 
			process.env.npm_package_config_frauLocalAppResolver_appClass;
	},
	getConfigFile: function(argv) {
		return argv.configfile || 
			process.env.npm_package_config_frauLocalAppResolver_configFile;
	},
	getDist: function(argv) {
		return argv.dist || 
			process.env.npm_package_config_frauLocalAppResolver_dist;
	},
	getHostname: function(argv) {
		return argv.hostname || 
			process.env.npm_package_config_frauLocalAppResolver_hostname;
	},
	getPort: function(argv) {
		return argv.port || 
			process.env.npm_package_config_frauLocalAppResolver_port;
	},
	getOptions: function(argv) {
		return {
			appClass: this.getAppClass(argv),
			configFile: this.getConfigFile(argv),
			dist: this.getDist(argv),
			hostname: this.getHostname(argv),
			port: this.getPort(argv)
		};
	}
};
