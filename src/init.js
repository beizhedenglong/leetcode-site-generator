const shell = require('shelljs');
const path = require('path');
const ora = require('ora');


module.exports = () => {
  const websiteDirPath = path.join(__dirname, '..', 'packages', 'leetcode-site-base');
  const spinner = ora('Copying files into leetcode-site-base...').start();
  shell.cp('-r', websiteDirPath, 'leetcode-site-base');
  spinner.stop();
};
