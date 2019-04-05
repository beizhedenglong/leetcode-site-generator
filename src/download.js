const fs = require('fs');
const path = require('path');
const { getAllACQuestions, getAcCode } = require('./leetcode');

const toDoc = ({
  title,
  titleSlug,
  lang,
  code,
  content,
}) => {
  const str = (
    // eslint-disable-next-line
`---
id: ${titleSlug}
title: ${title}
sidebar_label: ${title}
---
## Description
${content}

## Code
\`\`\`${lang}
${code}
\`\`\``
  );
  return str;
};

const download = async () => {
  const codeDir = path.join(__dirname, 'docs');
  const questions = await getAllACQuestions();
  const isCodeDirExist = fs.existsSync(codeDir);
  if (!isCodeDirExist) {
    fs.mkdirSync(codeDir);
  }
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
    fs.writeFile(path.join(codeDir, `${current.titleSlug}.md`), toDoc(current), (err) => {
      if (err) {
        console.error(`${current.titleSlug} write error`);
      }
    });
    aux(xs);
  };
  aux([...questions]);
};

module.exports = download;
