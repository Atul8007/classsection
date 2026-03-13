const path = require('path');
const fse = require('fs-extra');
const { glob } = require('glob');

async function getSectionFiles(themeDir) {
  const pattern = path.join(themeDir, 'sections', '*.liquid').replace(/\\/g, '/');
  return glob(pattern);
}

async function createBackup(filePath, backupDir) {
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${path.parse(fileName).name}_${timestamp}.liquid`;
  const dest = path.join(backupDir, backupName);

  await fse.ensureDir(backupDir);
  await fse.copy(filePath, dest);

  return dest;
}

function resolveBackupDir(themeDir) {
  return path.join(themeDir, '.classsection-backups');
}

module.exports = {
  getSectionFiles,
  createBackup,
  resolveBackupDir,
};
