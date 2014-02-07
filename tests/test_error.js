var sdi = require('../lib/index.js'),
	assert = require('assert');

describe('Error injection', function() {

	beforeEach(function() {
		sdi.resetDefaultContext();
		assert.equal(sdi.defaultContext().length, 0);
	});

	it('Error in params order', function() {
		var f = function(x, $a, y, $b) {
			return x + $a + $b;
		};

		try {
			sdi.wrapFunction(f, {$a: 2, $b: 3});
			assert.fail();
		}
		catch(e) {
			assert(e.toString().match(/No standard parameters after injected parameters/));
		}
	});

	it('Dependency not resolved', function() {
		var f = function(x, $a) {
			return x + $a;
		};

		var ff = sdi.wrapFunction(f, {$z: 'a'});
		try {
			ff(2);
		}
		catch(e) {
			assert(e.toString().match(/Unable to resolve/));
		}
	});

});