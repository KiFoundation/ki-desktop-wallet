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
      mode: 'preprod',
    });
  } catch (error) {
    console.error('BUILD ERROR :: ', error);
  }
}

function buildMain() {
  const mainPath = Path.join(__dirname, '..', 'src', 'main', 'preprod');
  return compileTs(mainPath);
}

function replaceVersionInHTML() {
  const htmlFiles = [
    Path.join(__dirname, '..', 'src', 'main', 'static', 'splashscreen-template.html'),
    Path.join(__dirname, '..', 'build', 'renderer', 'index.html'),
  ];

  for (let index = 0; index < htmlFiles.length; index++) {
    const htmlPath = htmlFiles[index];
    FileSystem.readFile(htmlPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/%VERSION%/g, version);

      FileSystem.writeFile(htmlPath.replace('-template', ''), result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
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
