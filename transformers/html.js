/**
 * HTML file transformer — injects a custom class placeholder into HTML files.
 */

const { addCustomClass } = require('../src/index');

const DEFAULT_CLASS_EXPR = 'custom-class';

function transform(content, options) {
  const classExpr = (options && options.classExpr) || DEFAULT_CLASS_EXPR;
  const warnings = [];

  if (content.indexOf(classExpr) !== -1) {
    return { content, modified: false, warnings: [] };
  }

  const result = addCustomClass(content, classExpr);
  if (!result.modified) {
    warnings.push('No element with class attribute found');
  }

  return { content: result.content, modified: result.modified, warnings };
}

module.exports = { transform, DEFAULT_CLASS_EXPR };
