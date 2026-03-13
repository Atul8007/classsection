const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getSectionFiles } = require('../utils/file-utils');
const { extractSchema, hasCustomClassSetting } = require('../core/schema-parser');
const { hasCustomClassInMarkup } = require('../core/wrapper-injector');
const { logger } = require('../utils/logger');

async function scanSections({ dir }) {
  const themeDir = path.resolve(dir);
  const files = await getSectionFiles(themeDir);

  if (files.length === 0) {
    logger.warn('No section files found in ' + path.join(themeDir, 'sections'));
    return;
  }

  logger.header(`Scanning ${files.length} section file(s) in ${themeDir}`);

  const results = {
    hasCustomClass: [],
    missingSchema: [],
    missingSetting: [],
    missingMarkup: [],
  };

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const content = await fse.readFile(filePath, 'utf-8');
    const schema = extractSchema(content);

    if (!schema) {
      results.missingSchema.push(fileName);
      continue;
    }

    const hasSetting = hasCustomClassSetting(schema.json);
    const hasMarkup = hasCustomClassInMarkup(content);

    if (hasSetting && hasMarkup) {
      results.hasCustomClass.push(fileName);
    } else if (!hasSetting) {
      results.missingSetting.push(fileName);
    } else if (!hasMarkup) {
      results.missingMarkup.push(fileName);
    }
  }

  console.log('');

  if (results.hasCustomClass.length) {
    logger.success(`${results.hasCustomClass.length} file(s) already have custom_class:`);
    results.hasCustomClass.forEach((f) => console.log(`    ${chalk.green(f)}`));
  }

  if (results.missingSetting.length) {
    logger.warn(`${results.missingSetting.length} file(s) missing custom_class setting:`);
    results.missingSetting.forEach((f) => console.log(`    ${chalk.yellow(f)}`));
  }

  if (results.missingMarkup.length) {
    logger.warn(`${results.missingMarkup.length} file(s) have setting but missing markup injection:`);
    results.missingMarkup.forEach((f) => console.log(`    ${chalk.yellow(f)}`));
  }

  if (results.missingSchema.length) {
    logger.skip(`${results.missingSchema.length} file(s) have no schema block (skipped):`);
    results.missingSchema.forEach((f) => console.log(`    ${chalk.gray(f)}`));
  }

  console.log('');
  return results;
}

module.exports = { scanSections };
