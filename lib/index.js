
require('./function_introspect');

var default_context = [];

exports.resetDefaultContext = function() {
  default_context = [];
};

exports.defaultContext = function() {
  return default_context;
};

exports.addToDefaultContext = function() {
  var args = arguments;
  Object.keys(args).forEach(function(x) {
    default_context.push(args[x]);
  });
};

var wrapFunction = exports.wrapFunction = function(f) {
  var should_be_wrapped = false;
  var last_standard_params = -1;
  var args = f.argsName();
  var contexts = arguments;
  if (Object.keys(contexts).length === 1) {
    Array.prototype.push.call(contexts, default_context);
  }
  for (var k = 0; k < args.length; k++) {
    if (args[k][0] === '$') {
      should_be_wrapped = true;
    }
    else {
      last_standard_params = k;
      if (should_be_wrapped) {
        throw new Error('No standard parameters after injected parameters ' + args.join(' '));
      }
    }
  }
  if (!should_be_wrapped) {
    return f;
  }
  var cache_array;
  return function() {
    if (!cache_array) {
      cache_array = [];
      for (var i = 0; i < args.length; i++) {
        if (args[i][0] !== '$') {
          cache_array.push(undefined);
        }
        else {
          var ok = false;
          for(var j = 1; j < contexts.length; j ++) {
            var a = contexts[j];
            if (!Array.isArray(a)) {
              a = [a];
            }
            for(var b = 0; b < a.length; b ++) {
              if (a[b][args[i]]) {
                ok = true;
                cache_array.push(a[b][args[i]]);
              }
            }
          }
          if (!ok) {
            throw new Error('Unable to resolve ' + args[i]);
          }
        }
      }
    }
    for (var z = 0; z <= last_standard_params; z++) {
      cache_array[z] = arguments[z];
    }
    return f.apply(this, cache_array);
  };
};

exports.wrapModule = function(m) {
  var mm = {};
  var args = [undefined];
  for(var i = 1; i < arguments.length; i ++) {
    args.push(arguments[i]);
  }
  if (args.length === 1) {
    args.push(default_context);
  }
  args.push({$self: mm});
  Object.keys(m).forEach(function(x) {
    if (typeof m[x] === 'function') {
      args[0] = m[x];
      mm[x] = wrapFunction.apply({}, args);
    }
  });
  return mm;

};