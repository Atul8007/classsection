/**
 * Vue SFC transformer — injects custom class support into Vue single-file components.
 */

// Match class="..." on the first element inside <template>
const TEMPLATE_CLASS = /(<template[^>]*>\s*<[a-z][a-z0-9]*\b[^>]*?\bclass\s*=\s*")([^"]*?)(")/i;

// Match :class="..." on the first element inside <template>
const TEMPLATE_BIND_CLASS = /(<template[^>]*>\s*<[a-z][a-z0-9]*\b[^>]*?\b:class\s*=\s*")([^"]*?)(")/i;

function transform(content, options) {
  const propName = (options && options.propName) || 'customClass';
  const warnings = [];

  // Skip if already using sectionClass or customClass prop
  if (content.indexOf('sectionClass') !== -1) {
    return { content, modified: false, warnings: [] };
  }

  // Try static class="..."
  let match = content.match(TEMPLATE_CLASS);
  if (match) {
    const baseClass = match[2];
    const replacement = ':class="sectionClass(\'' + baseClass + '\', { custom: ' + propName + ' })"';

    content = content.replace(
      TEMPLATE_CLASS,
      match[1].replace('class="', ':class="sectionClass(\'' + baseClass + '\', { custom: ' + propName + ' })') + match[3]
    );

    // Simpler: just replace the whole match
    content = content.replace(
      'class="' + baseClass + '"',
      ':class="sectionClass(\'' + baseClass + '\', { custom: ' + propName + ' })"'
    );

    return { content, modified: true, warnings };
  }

  // Try :class="..." binding
  match = content.match(TEMPLATE_BIND_CLASS);
  if (match) {
    warnings.push('Existing :class binding found — manual review recommended');
    return { content, modified: false, warnings };
  }

  warnings.push('No class attribute found on root template element');
  return { content, modified: false, warnings };
}

module.exports = { transform };
