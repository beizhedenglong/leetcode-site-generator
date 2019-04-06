const fs = require('fs');
const ora = require('ora');
const { getAllACQuestions, getAcCode } = require('./leetcode');

const download = async () => {
  const problemsPath = 'problems.json';
  const problems = [];
  const questions = await getAllACQuestions();
  const spinner = ora('Downloading accepted code.').start();
  const aux = async (xs = []) => {
    if (xs.length === 0) {
      return;
    }
    const current = xs.shift();
    const {
      code,
      lang,
    } = await getAcCode(current.titleSlug);
    current.code = code;
    current.lang = lang;
    spinner.text = `${questions.length - xs.length}/${questions.length}: [${current.title}] has downloaded.`;
    problems.push(current);
    fs.writeFileSync(problemsPath, JSON.stringify(problems));
    await aux(xs);
  };
  await aux([...questions]);
  spinner.stop();
};

module.exports = download;
