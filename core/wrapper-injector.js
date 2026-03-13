/**
 * Inject {{ section.settings.custom_class }} into the wrapper element's class attribute.
 */

const CUSTOM_CLASS_OUTPUT = '{{ section.settings.custom_class }}';

// Matches the first HTML tag that has a class="..." attribute
const WRAPPER_CLASS_REGEX = /(<[a-z][a-z0-9]*\b[^>]*?\bclass\s*=\s*")([^"]*?)(")/i;

function hasCustomClassInMarkup(content) {
  return content.includes(CUSTOM_CLASS_OUTPUT);
}

function injectCustomClass(content) {
  if (hasCustomClassInMarkup(content)) {
    return { content, injected: false };
  }

  const match = content.match(WRAPPER_CLASS_REGEX);
  if (!match) {
    return { content, injected: false };
  }

  const before = match[1];   // <tag ... class="
  const classes = match[2];  // existing-classes
  const after = match[3];    // "

  const newClasses = classes
    ? `${classes} ${CUSTOM_CLASS_OUTPUT}`
    : CUSTOM_CLASS_OUTPUT;

  const updated = content.replace(
    WRAPPER_CLASS_REGEX,
    `${before}${newClasses}${after}`
  );

  return { content: updated, injected: true };
}

module.exports = {
  CUSTOM_CLASS_OUTPUT,
  hasCustomClassInMarkup,
  injectCustomClass,
};
