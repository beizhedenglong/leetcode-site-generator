const fs = require('fs');
const path = require('path');
const sidebars = require('../sidebars.json');
const { docDirPath, sidebarsPath } = require('./generateDocs');

sidebars.docs.Problems.forEach((titleSlug) => {
  const problemPath = path.join(docDirPath, `${titleSlug}.md`);
  if (fs.existsSync(problemPath)) {
    fs.unlinkSync(problemPath);
  }
});
sidebars.docs.Problems = [];

fs.writeFileSync(sidebarsPath, JSON.stringify(sidebars, null, 2));
