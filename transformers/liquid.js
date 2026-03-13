/**
 * Liquid file transformer — injects custom_class into Shopify section files.
 */

const { addCustomClass } = require('../src/index');
const { extractSchema, hasCustomClassSetting, addCustomClassSetting, rebuildSchemaTag, SCHEMA_REGEX } = require('../core/schema-parser');

const LIQUID_CLASS_EXPR = '{{ section.settings.custom_class }}';

function transform(content, options) {
  const warnings = [];
  let modified = false;

  const schema = extractSchema(content);
  if (!schema) {
    return { content, modified: false, warnings: ['No {% schema %} block found'] };
  }

  // Add schema setting if missing
  if (!hasCustomClassSetting(schema.json)) {
    const updatedSchema = addCustomClassSetting({ ...schema.json });
    const newSchemaTag = rebuildSchemaTag(updatedSchema);
    content = content.replace(SCHEMA_REGEX, newSchemaTag);
    modified = true;
  }

  // Inject into wrapper markup if missing
  if (content.indexOf(LIQUID_CLASS_EXPR) === -1) {
    const result = addCustomClass(content, LIQUID_CLASS_EXPR);
    if (result.modified) {
      content = result.content;
      modified = true;
    } else {
      warnings.push('No wrapper class attribute found for injection');
    }
  }

  return { content, modified, warnings };
}

module.exports = { transform, LIQUID_CLASS_EXPR };
