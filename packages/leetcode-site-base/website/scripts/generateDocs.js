const fs = require('fs');
const path = require('path');
const problems = require('../problems.json');
const sidebars = require('../sidebars.json');

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
<div class="description">
${content}
</div>

## Solution
\`\`\`${lang}
${code}
\`\`\``
  );
  return str;
};

const docDirPath = path.join(__dirname, '..', '..', 'docs');
const sidebarsPath = path.join(__dirname, '..', 'sidebars.json');

if (!fs.existsSync(docDirPath)) {
  fs.mkdirSync(docDirPath);
}
sidebars.docs.Problems = [];
problems.forEach((problem) => {
  const filename = `${problem.titleSlug}.md`;
  fs.writeFile(path.join(docDirPath, filename), toDoc(problem), (err) => {
    if (err) {
      console.error(`write ${filename} error`);
    }
  });
  sidebars.docs.Problems.push(problem.titleSlug);
  fs.writeFileSync(sidebarsPath, JSON.stringify(sidebars));
});

module.exports = {
  docDirPath,
  sidebarsPath,
};
