var sdi = require('../lib/index.js'),
	assert = require('assert');

function MyObj() {
}

MyObj.prototype.f1 = function(a, $b) {
	return a + $b;
};


MyObj.prototype.f2 = function(a, $c, $this) {
	return $this.f1(a) + $c;
};

MyObj.prototype.a = 'r';

describe('Object injection', function() {

	beforeEach(function() {
		sdi.resetDefaultContext();
		assert.equal(sdi.defaultContext().length, 0);
	});

	it('Simple', function() {
		var o = new MyObj();
		var oo = sdi.wrapObject(o, {$b: 26, $c: 13});
		assert.equal(oo.f1(2), 28);
		assert.equal(oo.f2(2), 41);

		sdi.addToDefaultContext({$b: 26, $c: 13});
		var ooo = sdi.wrapObject(o);
		assert.equal(ooo.f2(2), 41);
	});

});