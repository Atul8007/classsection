#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { addCustomClass } = require('../features/add-custom-class');
const { scanSections } = require('../features/scan-sections');
const { showBanner } = require('../utils/banner');

showBanner();

program
  .name('classsection')
  .description('CLI tool to scan and modify Shopify theme section files')
  .version('1.0.0');

program
  .command('add-custom-class')
  .description('Add custom_class schema setting and inject it into wrapper elements')
  .option('-d, --dir <path>', 'Path to theme directory', '.')
  .option('--dry-run', 'Preview changes without writing files', false)
  .option('--no-backup', 'Skip creating backup files')
  .action(async (options) => {
    try {
      await addCustomClass(options);
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('scan')
  .description('Scan and report on section files without making changes')
  .option('-d, --dir <path>', 'Path to theme directory', '.')
  .action(async (options) => {
    try {
      await scanSections(options);
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse();
