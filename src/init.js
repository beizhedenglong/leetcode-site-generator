const shell = require('shelljs');
const path = require('path');
const ora = require('ora');
const fs = require('fs');


module.exports = () => {
  const destination = 'leetcode-site-base';
  if (fs.existsSync(destination)) {
    console.error('Already has leetcode-site-base directory!');
    return;
  }
  const websiteDirPath = path.join(__dirname, '..', 'packages', 'leetcode-site-base');
  const spinner = ora('Copying files into leetcode-site-base...').start();
  shell.cp('-r', websiteDirPath);
  spinner.stop();
};
