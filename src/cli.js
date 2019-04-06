#!/usr/bin/env node
const commander = require('commander');
const packageJson = require('../package.json');
const download = require('./download');
const init = require('./init');

commander
  .version(packageJson.version);

commander
  .command('download')
  .description('Download your accepted code from LeetCode.')
  .action(download);

commander
  .command('init')
  .description('Generate your personal LeetCode website.')
  .action(init);

commander.parse(process.argv);
