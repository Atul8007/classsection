#!/usr/bin/env node

try {
  const chalk = require('chalk');
  const { showBanner } = require('../utils/banner');
  showBanner();
  console.log(chalk.green('  classsection installed successfully!'));
  console.log(chalk.gray('  Run "classsection --help" to get started.\n'));
} catch {
  // Silently ignore if chalk is not yet available during install
}
