/**
 * JSX/TSX file transformer — injects custom class support into React components.
 */

const DEFAULT_PROP = 'className';
const DEFAULT_IMPORT = "import { sectionClass } from 'classsection';";

// Match className="static-classes"
const CLASSNAME_STATIC = /(\bclassName\s*=\s*")([^"]*?)(")/;

// Match className={'static-classes'} or className={"static-classes"}
const CLASSNAME_BRACES = /(\bclassName\s*=\s*\{\s*['"])([^'"]*?)(['"]\s*\})/;

function transform(content, options) {
  const warnings = [];
  const propName = (options && options.propName) || 'customClass';

  // Skip if already using sectionClass
  if (content.indexOf('sectionClass') !== -1) {
    return { content, modified: false, warnings: [] };
  }

  // Try static className="..."
  let match = content.match(CLASSNAME_STATIC);
  if (match) {
    const baseClass = match[2];
    const replacement = 'className={sectionClass(\'' + baseClass + '\', { custom: ' + propName + ' })}';
    content = content.replace(CLASSNAME_STATIC, replacement);

    // Add import if missing
    if (content.indexOf(DEFAULT_IMPORT) === -1 && content.indexOf('sectionClass') !== -1) {
      content = DEFAULT_IMPORT + '\n' + content;
    }

    return { content, modified: true, warnings };
  }

  // Try className={'...'}
  match = content.match(CLASSNAME_BRACES);
  if (match) {
    const baseClass = match[2];
    const replacement = 'className={sectionClass(\'' + baseClass + '\', { custom: ' + propName + ' })}';
    content = content.replace(CLASSNAME_BRACES, replacement);

    if (content.indexOf(DEFAULT_IMPORT) === -1) {
      content = DEFAULT_IMPORT + '\n' + content;
    }

    return { content, modified: true, warnings };
  }

  warnings.push('No className attribute found');
  return { content, modified: false, warnings };
}

module.exports = { transform, DEFAULT_IMPORT };
