const fs = require('fs');
const { getSessionPath } = require('./utils');

module.exports = () => {
  const sessionPath = getSessionPath();
  fs.unlinkSync(sessionPath);
};
