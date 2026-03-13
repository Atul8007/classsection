/**
 * Inject {{ section.settings.custom_class }} into the wrapper element's class attribute.
 * Delegates to the core addCustomClass function.
 */

const { addCustomClass: coreAddCustomClass } = require('../src/index');

const CUSTOM_CLASS_OUTPUT = '{{ section.settings.custom_class }}';

function hasCustomClassInMarkup(content) {
  return content.includes(CUSTOM_CLASS_OUTPUT);
}

function injectCustomClass(content) {
  const result = coreAddCustomClass(content, CUSTOM_CLASS_OUTPUT);
  return { content: result.content, injected: result.modified };
}

module.exports = {
  CUSTOM_CLASS_OUTPUT,
  hasCustomClassInMarkup,
  injectCustomClass,
};
