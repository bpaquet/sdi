var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;

Function.prototype.argsName = function() {
  var $inject;
  var argDecl;

  $inject = [];
  argDecl = this.toString().match(FN_ARGS);

  argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
    arg.replace(FN_ARG, function(all, underscore, name) {
      $inject.push(name);
    });
  });
  return $inject;
};
