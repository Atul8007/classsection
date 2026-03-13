const chalk = require('chalk');

const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✔'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.error(chalk.red('✖'), msg),
  skip: (msg) => console.log(chalk.gray('–'), msg),
  header: (msg) => console.log('\n' + chalk.bold.underline(msg)),
};

module.exports = { logger };
