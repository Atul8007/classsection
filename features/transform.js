const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { glob } = require('glob');
const { createBackup, resolveBackupDir } = require('../utils/file-utils');
const { logger } = require('../utils/logger');

const TRANSFORMERS = {
  liquid: require('../transformers/liquid'),
  html: require('../transformers/html'),
  jsx: require('../transformers/jsx'),
  tsx: require('../transformers/jsx'),
  vue: require('../transformers/vue'),
};

const DEFAULT_PATTERNS = {
  liquid: 'sections/**/*.liquid',
  html: '**/*.html',
  jsx: '**/*.jsx',
  tsx: '**/*.tsx',
  vue: '**/*.vue',
};

async function transformFiles({ dir, pattern, type, classExpr, dryRun, backup }) {
  const themeDir = path.resolve(dir);

  // Determine file types to process
  const types = type ? [type] : Object.keys(DEFAULT_PATTERNS);
  const shouldBackup = backup !== false;
  const backupDir = resolveBackupDir(themeDir);

  if (dryRun) {
    logger.info(chalk.cyan('DRY RUN — no files will be modified'));
  }

  let totalModified = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const fileType of types) {
    const transformer = TRANSFORMERS[fileType];
    if (!transformer) {
      logger.warn(`Unknown file type: ${fileType}`);
      continue;
    }

    const globPattern = pattern || DEFAULT_PATTERNS[fileType];
    const fullPattern = path.join(themeDir, globPattern).replace(/\\/g, '/');

    const files = await glob(fullPattern, {
      ignore: ['**/node_modules/**', '**/.classsection-backups/**'],
    });

    if (files.length === 0) continue;

    logger.header(`${fileType.toUpperCase()} — ${files.length} file(s)`);

    for (const filePath of files) {
      const fileName = path.relative(themeDir, filePath);

      try {
        const content = await fse.readFile(filePath, 'utf-8');
        const options = { classExpr: classExpr };
        const result = transformer.transform(content, options);

        if (result.warnings.length > 0) {
          result.warnings.forEach((w) => logger.warn(`${fileName} — ${w}`));
          totalWarnings += result.warnings.length;
        }

        if (!result.modified) {
          logger.skip(`${fileName} — no changes needed`);
          totalSkipped++;
          continue;
        }

        if (dryRun) {
          logger.info(`${fileName} — would be modified`);
        } else {
          if (shouldBackup) {
            await createBackup(filePath, backupDir);
          }
          await fse.writeFile(filePath, result.content, 'utf-8');
          logger.success(`${fileName} — updated`);
        }

        totalModified++;
      } catch (err) {
        logger.error(`${fileName} — ${err.message}`);
        totalErrors++;
      }
    }
  }

  console.log('');
  logger.header('Summary');
  console.log(`  Modified:  ${chalk.green(totalModified)}`);
  console.log(`  Skipped:   ${chalk.gray(totalSkipped)}`);
  console.log(`  Warnings:  ${chalk[totalWarnings ? 'yellow' : 'gray'](totalWarnings)}`);
  console.log(`  Errors:    ${chalk[totalErrors ? 'red' : 'gray'](totalErrors)}`);

  if (!dryRun && shouldBackup && totalModified > 0) {
    logger.info(`Backups saved to ${chalk.underline(backupDir)}`);
  }

  console.log('');
}

module.exports = { transformFiles };
