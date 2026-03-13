const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getSectionFiles, createBackup, resolveBackupDir } = require('../utils/file-utils');
const {
  extractSchema,
  hasCustomClassSetting,
  addCustomClassSetting,
  rebuildSchemaTag,
  SCHEMA_REGEX,
} = require('../core/schema-parser');
const { hasCustomClassInMarkup, injectCustomClass } = require('../core/wrapper-injector');
const { logger } = require('../utils/logger');

async function addCustomClass({ dir, dryRun, backup }) {
  const themeDir = path.resolve(dir);
  const files = await getSectionFiles(themeDir);

  if (files.length === 0) {
    logger.warn('No section files found in ' + path.join(themeDir, 'sections'));
    return;
  }

  const backupDir = resolveBackupDir(themeDir);
  const shouldBackup = backup !== false;

  if (dryRun) {
    logger.info(chalk.cyan('DRY RUN — no files will be modified'));
  }

  logger.header(`Processing ${files.length} section file(s)`);

  let modified = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const fileName = path.basename(filePath);

    try {
      let content = await fse.readFile(filePath, 'utf-8');
      const schema = extractSchema(content);

      if (!schema) {
        logger.skip(`${fileName} — no schema block found, skipping`);
        skipped++;
        continue;
      }

      const alreadyHasSetting = hasCustomClassSetting(schema.json);
      const alreadyHasMarkup = hasCustomClassInMarkup(content);

      if (alreadyHasSetting && alreadyHasMarkup) {
        logger.skip(`${fileName} — custom_class already present`);
        skipped++;
        continue;
      }

      // Add schema setting if missing
      if (!alreadyHasSetting) {
        const updatedSchema = addCustomClassSetting({ ...schema.json });
        const newSchemaTag = rebuildSchemaTag(updatedSchema);
        content = content.replace(SCHEMA_REGEX, newSchemaTag);
      }

      // Inject into wrapper markup if missing
      if (!alreadyHasMarkup) {
        const result = injectCustomClass(content);
        if (result.injected) {
          content = result.content;
        } else {
          logger.warn(`${fileName} — no wrapper class attribute found for injection`);
        }
      }

      if (dryRun) {
        logger.info(`${fileName} — would be modified`);
      } else {
        if (shouldBackup) {
          await createBackup(filePath, backupDir);
        }
        await fse.writeFile(filePath, content, 'utf-8');
        logger.success(`${fileName} — updated`);
      }

      modified++;
    } catch (err) {
      logger.error(`${fileName} — ${err.message}`);
      errors++;
    }
  }

  console.log('');
  logger.header('Summary');
  console.log(`  Modified: ${chalk.green(modified)}`);
  console.log(`  Skipped:  ${chalk.gray(skipped)}`);
  console.log(`  Errors:   ${chalk[errors ? 'red' : 'gray'](errors)}`);

  if (!dryRun && shouldBackup && modified > 0) {
    logger.info(`Backups saved to ${chalk.underline(backupDir)}`);
  }

  console.log('');
}

module.exports = { addCustomClass };
