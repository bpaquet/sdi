var sdi = require('../lib/index.js'),
	assert = require('assert');

describe('Function injection', function() {

	beforeEach(function() {
		sdi.resetDefaultContext();
		assert.deepEqual(sdi.defaultContext(), {});
	});

	it('No wrap', function() {
		var f = function(x) {
			return 2 * x;
		};

		assert.equal(sdi.wrapFunction(f)(1), 2);
		assert.equal(sdi.wrapFunction(f, {$a: 4}, {$b: 3})(2), 4);
	});

	it('Simple', function() {
		var f = function(x, $a, $b) {
			return x + $a + $b;
		};

		assert.equal(sdi.wrapFunction(f, {$a: 2, $b: 3})(1), 6);
		assert.equal(sdi.wrapFunction(f, {$a: 4}, {$b: 3})(2), 9);
	});

	it('Default context', function() {
		var f = function(x, $a, $b) {
			return x + $a + $b;
		};

		sdi.addToDefaultContext({$a: 2});

		assert.equal(sdi.wrapFunction(f, {$b: 2}, sdi.defaultContext())(1), 5);

		sdi.addToDefaultContext({$b: 3});
		assert.equal(sdi.wrapFunction(f, sdi.defaultContext())(1), 6);
		assert.equal(sdi.wrapFunction(f)(1), 6);
	});

	it('Missing param', function() {
		var f = function(x, $a) {
			return (x || 10) + $a;
		};

		assert.equal(sdi.wrapFunction(f, {$a: 2}, sdi.defaultContext())(1), 3);
		assert.equal(sdi.wrapFunction(f, {$a: 2}, sdi.defaultContext())(), 12);
	});

	it('two dependencies with the same name', function() {
		var f = function(x, $a, $b) {
			return x + $a + $b;
		};

		sdi.addToDefaultContext({$a: 2});
		sdi.addToDefaultContext({$a: 3});
		sdi.addToDefaultContext({$b: 4});
		sdi.addToDefaultContext({$b: 5});

		assert.equal(sdi.wrapFunction(f)(1), 9);
	});

	it('two dependencies with the same name', function() {
		var f = function(x, $a, $b) {
			return x + $a + $b;
		};

		sdi.addToDefaultContext({$a: 2});
		sdi.addToDefaultContext({$b: 4});

		assert.equal(sdi.wrapFunction(f, {$a:3}, {$b: 5})(1), 9);
	});

});