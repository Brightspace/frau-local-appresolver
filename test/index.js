var chai = require('chai'),
	expect = chai.expect;

import {appresolver} from '../lib/index';

describe('index', () => {

	it('should define appresolver', () => {
		expect(appresolver).to.be.a('Function');
	});

});
