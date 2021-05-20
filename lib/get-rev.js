const { exec } = require('child_process');
const { getLocalRev } = require('./svn-utils')

function getSVNRev(cwd) {
  return getLocalRev(cwd);
}

function getSVNBranch(cwd) {
  return '';
}

function getGITRev(cwd) {
  return new Promise((resolve, reject) => {
    const regex = /[\da-z]{7}/g;
    exec(
      '"git" rev-parse --shrot HEAD',
      { encoding: 'utf-8', cwd },
      (err, stdout, stderr) => {
        if (err) {
          reject('get git rev failed');
          return;
        }
        const match = regex.exec(stdout);
        console.log(`get git rev:${match[0]}`)
        resolve(match[0]);
      },
    );
  });
}

function getGITBranch(cwd) {
  return new Promise((resolve, reject) => {
    exec(
      '"git" rev-parse --abbrev-ref HEAD',
      { encoding: 'utf-8', cwd },
      (err, stdout, stderr) => {
        if (err) {
          reject('get git branch failed');
          return;
        }
        const branch = stdout.replace('\n', '');
        resolve(branch);
      },
    );
  });
}

module.exports = { getSVNRev, getGITRev, getGITBranch, getSVNBranch };
