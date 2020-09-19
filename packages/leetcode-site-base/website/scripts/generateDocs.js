const fs = require('fs');
const path = require('path');
const problems = require('../problems.json');
const sidebars = require('../sidebars.json');

const toDoc = ({
  title,
  titleSlug,
  lang = '',
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

## Solution(${lang})
\`\`\`${lang}
${code}
\`\`\``
  );
  return str;
};
const indexPage = indexDoc => (
  `<!DOCTYPE HTML>
    <html lang="en-US">

    <head>
      <meta charset="UTF-8">
      <meta http-equiv="refresh" content="0; url=docs/${indexDoc}">
      <script type="text/javascript">
        window.location.href = 'docs/${indexDoc}';
      </script>
      <title>LeetCode Site Generator</title>
    </head>

    <body>
      If you are not redirected automatically, follow this <a href="docs/${indexDoc}">link</a>.
    </body>

    </html>`
);

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
      console.error(`Write ${filename} error`);
    }
  });
  sidebars.docs.Problems.push(problem.titleSlug);
  fs.writeFileSync(sidebarsPath, JSON.stringify(sidebars, null, 2));
});
const indexDoc = sidebars.docs.Problems[0];
const staticPath = path.join(__dirname, '..', 'static');
if (indexDoc) {
  fs.writeFile(path.join(staticPath, 'index.html'), indexPage(indexDoc), (err) => {
    if (err) {
      console.error('Write index.html error');
    }
  });
}

module.exports = {
  docDirPath,
  sidebarsPath,
};
