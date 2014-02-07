
exports.f1 = function(a, $b) {
	return a + $b;
};

exports.f2 = function(a, $self, $c) {
	return $c + $self.f1(a);
};

exports.toto = 'tata';