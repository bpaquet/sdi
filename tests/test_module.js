var sdi = require('../lib/index.js'),
	assert = require('assert');

describe('Module injection', function() {

	beforeEach(function() {
		sdi.resetDefaultContext();
		assert.equal(sdi.defaultContext().length, 0);
	});

	it('Simple', function() {

		var m1 = sdi.wrapModule(require('./my_module'), {$b: 3, $c: 20});
		assert.equal(m1.f1(5), 8);
		assert.equal(m1.toto, 'tata');

		sdi.addToDefaultContext({$b: 2, $c: 40});
		var m2 = sdi.wrapModule(require('./my_module'));
		assert.equal(m2.f1(4), 6);
		assert.equal(m2.f2(4), 46);
	});

});