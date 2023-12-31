"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var excludeAopPrefix = 'exclude aop:';
function relativeDir(basePath, tempPath) {
  var path1s = basePath.split('/');
  var path2s = tempPath.split('/');
  var commIndex = 0;
  for (var i = 0; i < path1s.length && i < path2s.length; i++) {
    if (path1s[i] === path2s[i]) {
      commIndex = i;
    } else {
      break;
    }
  }
  var result = './';
  for (var _i = commIndex + 2; _i < path1s.length; _i++) {
    result += '../';
  }
  for (var _i2 = commIndex + 1; _i2 < path2s.length; _i2++) {
    result += path2s[_i2] + "/";
  }
  if (result.length > 2) {
    return result.substring(0, result.length - 1);
  }
  return result;
}
var _default = (0, _helperPluginUtils.declare)(function (api, options, dirname) {
  api.assertVersion(7);
  return {
    visitor: {
      Program: {
        enter: function enter(path, state) {
          var _path$node$body$;
          var leadingComment = (((_path$node$body$ = path.node.body[0]) === null || _path$node$body$ === void 0 ? void 0 : _path$node$body$.leadingComments) || [{
            value: ''
          }])[0].value;
          var excludeAop = [{
            component: undefined,
            module: undefined
          }];
          if (leadingComment.startsWith(excludeAopPrefix)) {
            excludeAop = JSON.parse(leadingComment.substring(excludeAopPrefix.length));
          } else {
            excludeAop = undefined;
          }
          path.traverse({
            ImportDeclaration: function ImportDeclaration(p) {
              var _options$replaceImpor;
              var source = p.node.source.value;
              (_options$replaceImpor = options.replaceImports) === null || _options$replaceImpor === void 0 ? void 0 : _options$replaceImpor.forEach(function (replaceImport) {
                if (source === replaceImport.module) {
                  var delIndex = -1;
                  p.node.specifiers.forEach(function (value, index) {
                    var _ref;
                    if (replaceImport.component === ((_ref = (value === null || value === void 0 ? void 0 : value.local) || {
                      name: undefined
                    }) === null || _ref === void 0 ? void 0 : _ref.name)) {
                      delIndex = index;
                      return;
                    }
                  });
                  var isExcludeP = false;
                  if (excludeAop) {
                    excludeAop.forEach(function (value) {
                      if (value.module === replaceImport.module && value.component === replaceImport.component) {
                        isExcludeP = true;
                        return;
                      }
                    });
                  }
                  if (delIndex > -1 && !isExcludeP) {
                    p.node.specifiers.splice(delIndex, 1);
                    var insertIndex = -1;
                    path.node.body.forEach(function (value, index) {
                      if (value.type === 'ImportDeclaration' && value.source.value === source) {
                        insertIndex = index + 1;
                        return;
                      }
                    });
                    if (insertIndex > -1) {
                      var _replaceImport$path;
                      if ((_replaceImport$path = replaceImport.path) !== null && _replaceImport$path !== void 0 && _replaceImport$path.startsWith('./')) {
                        replaceImport.replaceStr += ' \'' + relativeDir(state.filename.replace(state.cwd, "."), replaceImport.path) + '\';';
                      }
                      path.node.body.splice(insertIndex, 0, api.template.ast(replaceImport.replaceStr));
                    }
                  }
                }
              });
            }
          });
        }
      }
    }
  };
});
exports["default"] = _default;