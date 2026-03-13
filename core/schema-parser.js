/**
 * Parse and manipulate Shopify section schema blocks.
 */

const SCHEMA_REGEX = /\{%[-\s]*schema\s*[-]?%\}([\s\S]*?)\{%[-\s]*endschema\s*[-]?%\}/;

const CUSTOM_CLASS_SETTING = {
  type: 'text',
  id: 'custom_class',
  label: 'Custom CSS class',
  default: '',
  info: 'Add a custom CSS class to this section wrapper.'
};

function extractSchema(content) {
  const match = content.match(SCHEMA_REGEX);
  if (!match) return null;

  try {
    const json = JSON.parse(match[1]);
    return { json, raw: match[0], innerRaw: match[1] };
  } catch {
    return null;
  }
}

function hasCustomClassSetting(schemaJson) {
  if (!schemaJson.settings || !Array.isArray(schemaJson.settings)) {
    return false;
  }
  return schemaJson.settings.some((s) => s.id === 'custom_class');
}

function addCustomClassSetting(schemaJson) {
  if (!schemaJson.settings) {
    schemaJson.settings = [];
  }
  schemaJson.settings.push(CUSTOM_CLASS_SETTING);
  return schemaJson;
}

function rebuildSchemaTag(schemaJson) {
  const formatted = JSON.stringify(schemaJson, null, 2);
  return `{% schema %}\n${formatted}\n{% endschema %}`;
}

module.exports = {
  SCHEMA_REGEX,
  CUSTOM_CLASS_SETTING,
  extractSchema,
  hasCustomClassSetting,
  addCustomClassSetting,
  rebuildSchemaTag,
};
