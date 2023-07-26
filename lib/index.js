"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var _default = (0, _helperPluginUtils.declare)(function (api, options, dirname) {
  api.assertVersion(7);
  return {
    visitor: {
      Program: {
        enter: function enter(path, state) {
          path.traverse({
            ImportDeclaration: function ImportDeclaration(p) {
              var _options$replaceImpor;
              var source = p.node.source.value;
              (_options$replaceImpor = options.replaceImports) === null || _options$replaceImpor === void 0 ? void 0 : _options$replaceImpor.forEach(function (replaceImport) {
                if (source === replaceImport.module) {
                  var delIndex = -1;
                  p.node.specifiers.forEach(function (value, index) {
                    if (replaceImport.component === value.imported.name) {
                      delIndex = index;
                      return;
                    }
                  });
                  if (delIndex > -1) {
                    p.node.specifiers.splice(delIndex, 1);
                    var insertIndex = -1;
                    path.node.body.forEach(function (value, index) {
                      if (value.type === 'ImportDeclaration' && value.source.value === source) {
                        insertIndex = index + 1;
                        return;
                      }
                    });
                    if (insertIndex > -1) {
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