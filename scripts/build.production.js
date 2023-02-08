const Path = require('path');
const Chalk = require('chalk');
const FileSystem = require('fs');
const Vite = require('vite');
const compileTs = require('./private/tsc');
const version = require('../package.json').version;

function buildRenderer() {
  console.log(Chalk.bgBlue('Transpiling renderer'));
  try {
    return Vite.build({
      configFile: Path.join(__dirname, '..', 'vite.config.ts'),
      base: './',
      mode: 'production',
    });
  } catch (error) {
    console.error(error);
  }
}

function replaceVersionInHTML() {
  const htmlFiles = [
    Path.join(__dirname, '..', 'build', 'main', 'static', 'splashscreen.html'),
    Path.join(__dirname, '..', 'build', 'renderer', 'index.html'),
  ];

  for (let index = 0; index < htmlFiles.length; index++) {
    const htmlPath = htmlFiles[index];
    FileSystem.readFile(htmlPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/%VERSION%/g, version);

      FileSystem.writeFile(htmlPath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
}

function buildMain() {
  const mainPath = Path.join(__dirname, '..', 'src', 'main', 'production');
  return compileTs(mainPath);
}

FileSystem.rmSync(Path.join(__dirname, '..', 'build'), {
  recursive: true,
  force: true,
});

console.log(Chalk.blueBright('Transpiling renderer & main...'));

Promise.allSettled([buildRenderer(), buildMain()]).then(() => {
  new Promise((res, rej) => {
    try {
      replaceVersionInHTML();
      Chalk.greenBright('Version properly replaced in html files');
      res();
    } catch (error) {
      rej(error);
    }
  })
    .then(() => {
      console.log(
        Chalk.greenBright(
          'Renderer & main successfully transpiled! (ready to be built with electron-builder)'
        )
      );
    })
    .catch((err) => {
      console.error(err);
    });
});
