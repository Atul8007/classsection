# classsection

CLI tool to scan Shopify theme folders and inject a `custom_class` schema setting into section files.

## What it does

- Scans `/sections/*.liquid` files in a Shopify theme
- Adds a `custom_class` text setting to each section's `{% schema %}` block
- Injects `{{ section.settings.custom_class }}` into the first wrapper element's `class` attribute
- Skips files that already have the setting
- Creates timestamped backups before modifying files

## Install

```bash
npm install -g classsection
```

Or run directly:

```bash
npx classsection <command>
```

## Usage

### Scan sections (read-only)

Report which section files have or are missing the `custom_class` setting:

```bash
classsection scan
classsection scan --dir /path/to/theme
```

### Add custom class

Add the `custom_class` setting and markup injection to all section files:

```bash
classsection add-custom-class
classsection add-custom-class --dir /path/to/theme
classsection add-custom-class --dry-run
classsection add-custom-class --no-backup
```

### Options

| Flag | Description |
|------|-------------|
| `-d, --dir <path>` | Path to theme directory (default: `.`) |
| `--dry-run` | Preview changes without writing files |
| `--no-backup` | Skip creating backup files |

## Schema setting added

```json
{
  "type": "text",
  "id": "custom_class",
  "label": "Custom CSS class",
  "default": "",
  "info": "Add a custom CSS class to this section wrapper."
}
```

## Markup injection

Before:

```html
<div class="section-wrapper">
```

After:

```html
<div class="section-wrapper {{ section.settings.custom_class }}">
```

## Project structure

```
classsection/
├── bin/cli.js            # CLI entry point
├── core/
│   ├── schema-parser.js  # Schema extraction and manipulation
│   └── wrapper-injector.js # Markup class injection
├── features/
│   ├── add-custom-class.js # Add command implementation
│   └── scan-sections.js    # Scan command implementation
├── utils/
│   ├── file-utils.js     # File and glob utilities
│   └── logger.js         # Colored console output
├── package.json
├── README.md
└── LICENSE
```

## License

MIT
