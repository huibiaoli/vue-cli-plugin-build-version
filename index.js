let fs = require('fs');
let { getSVNRev, getGITRev, getGITBranch, getSVNBranch } = require('./lib/get-rev');

function witerFile(path, data) {
  fs.writeFile(path, data, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('build version done.');
    }
  });
}

module.exports = (api, projectOptions) => {
  api.registerCommand(
    'bundle-version',
    {
      description: 'generate version file for vue cli',
      usage: 'vue-cli-service bundle-version',
      options: {},
    },
    async (_) => {
      try {
        const options = projectOptions.pluginOptions.bundleVersion;
        const defaultVersion = new Date().toLocaleString();
        const { path, env, versionPath, name, cvs } = options;
        const DIR = `${path}/${versionPath}`;
        const FILENAME = name || 'version';
        const CVS = cvs || 'git';
        const FULLPATH = `${DIR}/${FILENAME}.json`;

        const getRev = CVS === 'git' ? getGITRev : getSVNRev
        const getBranch = CVS === 'git' ? getGITBranch : getSVNBranch
        const rev = await getRev().catch((e) => {
          console.log(e);
        });
        const branch = await getBranch().catch((e) => {
          console.log(e);
        });
        let obj = {
          date: defaultVersion,
          cvs: CVS,
          rev: rev,
          branch: branch,
        };

        fs.access(DIR, fs.constants.F_OK, function (err) {
          if (err) {
            // write version.js
            fs.mkdir(`${path}`, function () {
              if (versionPath) {
                fs.mkdir(`${path}/${versionPath}`, function () {
                  witerFile(FULLPATH, JSON.stringify(obj));
                });
              } else {
                witerFile(FULLPATH, JSON.stringify(obj));
              }
            });
          } else {
            witerFile(FULLPATH, JSON.stringify(obj));
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
  );
};

module.exports.defaultModes = {
  build: 'production',
};
