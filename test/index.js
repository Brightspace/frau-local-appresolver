var chai = require('chai'),
	expect = chai.expect,
	appresolver = require('../lib/index');

describe('index', function() {

	it('should define appresolver', function() {
		expect(appresolver).to.be.a('Object');
	});

	it('should define appresolver', function() {
		expect(appresolver.resolver).to.be.a('Function');
	});

	it('should define appresolver', function() {
		expect(appresolver.optionsProvider).to.be.a('Object');
	});

});
