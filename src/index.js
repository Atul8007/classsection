/**
 * classsection — Lightweight utility for section class injection.
 * Zero dependencies. Works in browser and Node.js.
 *
 * @example
 * const { sectionClass, addCustomClass, mergeSectionClasses } = require('classsection');
 *
 * sectionClass('hero', { custom: 'my-class', modifiers: { dark: true } })
 * // => 'hero hero--dark my-class'
 */

'use strict';

/**
 * Build a section class string from a base class, optional modifiers, and custom classes.
 *
 * @param {string} base - The base section class name (e.g. 'hero')
 * @param {object} [options] - Options object
 * @param {string} [options.custom] - Custom class(es) to append
 * @param {Record<string, boolean>} [options.modifiers] - BEM-style modifiers
 * @param {string} [options.prefix] - Custom modifier prefix (default: '--')
 * @returns {string} Merged class string
 */
function sectionClass(base, options) {
  if (!base && !options) return '';
  var parts = [];
  var b = typeof base === 'string' ? base.trim() : '';
  if (b) parts.push(b);

  if (options && typeof options === 'object') {
    var prefix = options.prefix || '--';

    if (options.modifiers && typeof options.modifiers === 'object') {
      var mods = options.modifiers;
      for (var key in mods) {
        if (mods.hasOwnProperty(key) && mods[key]) {
          parts.push(b + prefix + key);
        }
      }
    }

    if (options.custom) {
      var c = typeof options.custom === 'string' ? options.custom.trim() : '';
      if (c) parts.push(c);
    }
  }

  return parts.join(' ');
}

/**
 * Inject a class expression into the first HTML element's class attribute.
 *
 * @param {string} content - HTML/Liquid/template content
 * @param {string} classExpression - The class expression to inject
 * @returns {{ content: string, modified: boolean }}
 */
function addCustomClass(content, classExpression) {
  if (!content || !classExpression) return { content: content || '', modified: false };
  if (content.indexOf(classExpression) !== -1) return { content: content, modified: false };

  var re = /(<[a-z][a-z0-9]*\b[^>]*?\bclass\s*=\s*")([^"]*?)(")/i;
  var m = content.match(re);
  if (!m) return { content: content, modified: false };

  var existing = m[2];
  var merged = existing ? existing + ' ' + classExpression : classExpression;
  var updated = content.replace(re, m[1] + merged + m[3]);

  return { content: updated, modified: true };
}

/**
 * Merge multiple class sources into a single class string.
 * Accepts strings, arrays, and objects (keys with truthy values).
 *
 * @param {...(string|string[]|Record<string,boolean>|null|undefined|false)} args
 * @returns {string}
 *
 * @example
 * mergeSectionClasses('hero', { 'hero--dark': true, 'hero--light': false }, 'custom')
 * // => 'hero hero--dark custom'
 */
function mergeSectionClasses() {
  var classes = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;
    if (typeof arg === 'string') {
      var t = arg.trim();
      if (t) classes.push(t);
    } else if (Array.isArray(arg)) {
      var nested = mergeSectionClasses.apply(null, arg);
      if (nested) classes.push(nested);
    } else if (typeof arg === 'object') {
      for (var key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(' ');
}

module.exports = {
  sectionClass: sectionClass,
  addCustomClass: addCustomClass,
  mergeSectionClasses: mergeSectionClasses
};
