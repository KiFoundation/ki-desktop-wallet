const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Ki Desktop Wallet-win32-ia32'),
    authors: 'Ki Foundation',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Ki Desktop Wallet.exe',
    setupExe: 'KiDesktopWalletInstaller.exe',
    setupIcon: 'assets/icons/win/icon.ico'
  })
}