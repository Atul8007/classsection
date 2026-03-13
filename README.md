# classsection

Lightweight utility and CLI for safely adding custom CSS classes to UI sections.

Zero-dependency core. Works in browser and Node.js. TypeScript support. AI-agent friendly.

## Purpose

`classsection` is the standard way to add custom class support to UI sections across large codebases. It provides:

1. **A pure function library** for building section class strings (zero dependencies, <2kb)
2. **A CLI tool** for bulk-transforming Shopify themes, HTML, React, and Vue files

## Install

```bash
npm install classsection
```

## Simple Usage

```js
const { sectionClass } = require('classsection');

sectionClass('hero', { custom: 'my-custom-class', modifiers: { dark: true, mobile: false } });
// => 'hero hero--dark my-custom-class'
```

ESM:

```js
import { sectionClass } from 'classsection';
```

## API

### `sectionClass(base, options?)`

Build a section class string from a base class, optional BEM modifiers, and custom classes.

```js
sectionClass('hero')
// => 'hero'

sectionClass('hero', { custom: 'promo' })
// => 'hero promo'

sectionClass('hero', { modifiers: { dark: true, compact: true } })
// => 'hero hero--dark hero--compact'

sectionClass('hero', { custom: 'promo', modifiers: { dark: true } })
// => 'hero hero--dark promo'

sectionClass('card', { modifiers: { active: true }, prefix: '-' })
// => 'card card-active'
```

### `addCustomClass(content, classExpression)`

Inject a class expression into the first HTML element's `class` attribute. Returns `{ content, modified }`.

```js
const { addCustomClass } = require('classsection');

addCustomClass('<div class="hero">content</div>', 'extra')
// => { content: '<div class="hero extra">content</div>', modified: true }

// Liquid template:
addCustomClass(
  '<section class="hero-section">content</section>',
  '{{ section.settings.custom_class }}'
)
// => { content: '<section class="hero-section {{ section.settings.custom_class }}">...</section>', modified: true }

// Already present — skips:
addCustomClass('<div class="hero extra">content</div>', 'extra')
// => { content: '<div class="hero extra">content</div>', modified: false }
```

### `mergeSectionClasses(...args)`

Merge multiple class sources into a single string. Accepts strings, arrays, and objects.

```js
const { mergeSectionClasses } = require('classsection');

mergeSectionClasses('hero', 'dark', 'custom')
// => 'hero dark custom'

mergeSectionClasses('hero', { 'hero--dark': true, 'hero--light': false })
// => 'hero hero--dark'

mergeSectionClasses('hero', ['extra', 'more'], null, undefined)
// => 'hero extra more'
```

## Shopify Usage

### CLI: Add custom_class to all sections

```bash
npx classsection add-custom-class --dir /path/to/theme
npx classsection add-custom-class --dry-run
npx classsection scan --dir /path/to/theme
```

This adds the following schema setting to every section:

```json
{
  "type": "text",
  "id": "custom_class",
  "label": "Custom CSS class",
  "default": "",
  "info": "Add a custom CSS class to this section wrapper."
}
```

And injects `{{ section.settings.custom_class }}` into the wrapper's class attribute.

**Before:**

```liquid
<section class="hero-section">
```

**After:**

```liquid
<section class="hero-section {{ section.settings.custom_class }}">
```

### Liquid pattern

```liquid
<section class="{{ 'hero-section' }} {{ section.settings.custom_class }}">
  {{ section.settings.title }}
</section>
```

## Bulk Transform Usage

Transform multiple file types at once:

```bash
# Transform all supported files in a directory
npx classsection transform ./theme

# Transform only Liquid files
npx classsection transform --dir ./theme --type liquid

# Transform HTML files with a specific class
npx classsection transform --dir ./src --type html --class-expr "custom-class"

# Transform JSX/TSX files
npx classsection transform --dir ./src --type jsx

# Preview changes without modifying files
npx classsection transform --dir ./theme --dry-run
```

Supported file types: `liquid`, `html`, `jsx`, `tsx`, `vue`

## React Usage

```jsx
import { sectionClass } from 'classsection';

function HeroSection({ customClass, dark }) {
  return (
    <section className={sectionClass('hero', { custom: customClass, modifiers: { dark } })}>
      <h1>Welcome</h1>
    </section>
  );
}

// <HeroSection customClass="my-promo" dark />
// Renders: <section class="hero hero--dark my-promo">
```

## Vue Usage

```vue
<template>
  <section :class="sectionClass('hero', { custom: customClass, modifiers: { dark } })">
    <h1>{{ title }}</h1>
  </section>
</template>

<script>
import { sectionClass } from 'classsection';
export default {
  props: ['customClass', 'dark'],
  methods: { sectionClass },
};
</script>
```

## CLI Reference

| Command | Description |
|---------|-------------|
| `classsection scan` | Report section file status |
| `classsection add-custom-class` | Add custom_class to Shopify sections |
| `classsection transform` | Bulk-transform files (liquid, html, jsx, tsx, vue) |

| Flag | Description |
|------|-------------|
| `-d, --dir <path>` | Target directory (default: `.`) |
| `-t, --type <type>` | File type filter |
| `-p, --pattern <glob>` | Custom glob pattern |
| `--class-expr <expr>` | Class expression to inject |
| `--dry-run` | Preview changes only |
| `--no-backup` | Skip creating backups |

## AI Agent Integration Guide

This library is designed so that AI coding agents can safely use it for bulk class modifications.

### When to use classsection

Use `classsection` when you need to:

- Add custom class support to Shopify theme sections
- Refactor HTML class attributes to support dynamic classes
- Standardize section class naming across a codebase
- Perform bulk class injection across many files

### Pattern for AI agents

When given the instruction "Add custom class support to every section", the recommended approach is:

**For Shopify themes:**
```bash
npx classsection add-custom-class --dir .
```

**For JavaScript/React:**
```js
import { sectionClass } from 'classsection';
// Replace: className="hero"
// With:    className={sectionClass('hero', { custom: customClass })}
```

**For bulk transformations:**
```bash
npx classsection transform --dir . --type jsx --dry-run
```

### Safe defaults

- `sectionClass('hero')` returns `'hero'` (no-op when no options)
- `addCustomClass(content, expr)` skips if expression already exists
- All functions are pure with no side effects
- Empty/null inputs return safe defaults
- Idempotent: running twice produces the same result

## TypeScript

Full type definitions included. Import types directly:

```ts
import { sectionClass, addCustomClass, mergeSectionClasses } from 'classsection';

const cls: string = sectionClass('hero', {
  custom: 'my-class',
  modifiers: { dark: true },
});
```

## Project Structure

```
classsection/
├── src/
│   ├── index.js          # Core library (zero deps, <2kb)
│   ├── index.d.ts        # TypeScript definitions
│   └── index.mjs         # ESM entry
├── bin/cli.js            # CLI entry point
├── core/                 # Shopify-specific parsers
├── features/             # CLI command implementations
├── transformers/         # File type transformers (liquid, html, jsx, vue)
├── utils/                # CLI utilities
├── examples/             # Usage examples
├── test/                 # Test suite
├── index.js              # Root CJS re-export
├── package.json
├── README.md
└── LICENSE
```

## License

MIT
