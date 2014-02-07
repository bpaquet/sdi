Simple Dependency Injection for NodeJS
===

SDI is a simple dependency injection engine, inspired from [Angular](http://angularjs.org/).

An example :

toto.js
````js
exports.myFunction = function(a, $logger, $config) {
	$logger.info('toto ' + a + ' ' + $config);
}
````

To use it :

main.js
````js
var sdi = require('sdi');

sdi.addToDefaultContext({
	$logger: {
		info: function(s) {
			console.log(s);
		},
		$config: 'myParam';
	}
});

sdi.require('./toto').myFunction('abc');

````

Output:
````
$ node main.js
toto abc myParam
````

