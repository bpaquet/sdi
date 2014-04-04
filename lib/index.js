var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;

var default_context = {};

var argsName = function(f) {
  var $inject;
  var argDecl;

  $inject = [];
  argDecl = f.toString().match(FN_ARGS);

  argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
    arg.replace(FN_ARG, function(all, underscore, name) {
      $inject.push(name);
    });
  });
  return $inject;
};

exports.resetDefaultContext = function() {
  default_context = {};
};

exports.defaultContext = function() {
  return default_context;
};

exports.addToDefaultContext = function(injections) {
  for(var attrname in injections) {
    default_context[attrname] = injections[attrname];
  }
};

var wrapFunction = exports.wrapFunction = function(f) {
  var should_be_wrapped = false;
  var last_standard_params = -1;
  var args = argsName(f);
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
          if (args[i].slice(0, 2) === '$$') {
            cache_array.push(require(args[i].slice(2)));
          }
          else {
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
    else {
      mm[x] = m[x];
    }
  });
  return mm;
};


exports.wrapObject = function(o) {
  var oo = {};
  var args = [undefined];
  for(var i = 1; i < arguments.length; i ++) {
    args.push(arguments[i]);
  }
  if (args.length === 1) {
    args.push(default_context);
  }
  args.push({$this: oo});
  Object.keys(Object.getPrototypeOf(o)).forEach(function(x) {
    if (typeof o[x] === 'function') {
      args[0] = o[x];
      oo[x] = wrapFunction.apply(o, args);
    }
  });
  return oo;
};