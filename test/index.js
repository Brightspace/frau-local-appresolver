var chai = require('chai'),
	expect = chai.expect;

import appresolver from '../lib/index';

describe('index', () => {

	it('should define appresolver', () => {
		expect(appresolver).to.be.a('Object');
	});

	it('should define appresolver', () => {
		expect(appresolver.resolver).to.be.a('Function');
	});

	it('should define appresolver', () => {
		expect(appresolver.optionsProvider).to.be.a('Object');
	});

});
