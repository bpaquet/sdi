Simple Dependency Injection for NodeJS
===

SDI is a simple dependency injection engine, inspired from [Angular](http://angularjs.org/).

An example :

**toto.js**
````js
exports.myFunction = function(a, $logger, $config) {
	$logger.info('toto ' + a + ' ' + $config);
}
````

To use it :

**main.js**
````js
var sdi = require('sdi');

sdi.addToDefaultContext({
  $logger: {
    info: function(s) {
      console.log(s);
  },
  $config: 'myParam',
});

sdi.require('./toto').myFunction('abc');

````

Output:
````
$ node main.js
toto abc myParam
````

### Context

For dependency injection, you need a context. A context is simple a map of objects, keys have to start with $.

````js
var myContext = {
  $a: require('fs')
};
````

If you specify no context, the default one is used.

You can add element to the default context with `sdi.addToDefaultContext(myContext)`;

### Use dependency injection on a full module :

````js
var m = sdi.require('./myModule'); // use default context
var m = sdi.require('./myModule', myContext); // use myContext as context
var m = sdi.require('./myModule', myContext1, {$b: 2}); // use 2 contexts
var m = sdi.require('./myModule', myContext1, sdi.defaultContext); // use myContext and the default context

m.myFunc();

````

In a module loaded through dependency injection, you can inject `$self` to call methods on the same module using dependency injection.

````js
exports.myFunc($logger) {
  ...
};

exports.myFunc2($logger, $self) {
  ...
  $self.myFunc();
};
````

### Use dependency injection on single function :

````js
function f(req, res, $logger, $component1, $component2) {
  ...
}

var ff = sdi.wrap_function(f); // you can also provide a context, see above.

ff(req, res);
````

### Use dependency injection on object :

````js
function MyObj() {
}

MyObj.prototype.myFunc = function($logger) {
};

var o = sdi.wrap_object(new MyObj()); // you can also provide a context, see above.
o.myFunc();
````

You can inject `$this` in object, to access to call methods with dependency injection. 

Using `$this` avoid to use `.bind(this)` on all sub function.

````js
MyObj.prototype.myFunc2 = function($logger, $this) {
  $this.myFunc();
};
````

### Performances

Dependency resolution is only performed on the first function call. All subsequents calls are very fast (just few object moves).

Use dependency injection only for long running object. Avoid to use it on short live object (eg on object created in an http request).

### Example : inject all the modules of a tools directory

**main.js**
````js
var sdi = require('sdi');

sdi.addToDefaultContext({$logger: require('./tools/logger')});
sdi.addToDefaultContext({component1: require('./tools/component1')});
sdi.addToDefaultContext({component2: require('./tools/component2')});

sdi.require('my_app').run();
````
