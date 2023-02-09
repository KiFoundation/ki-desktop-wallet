import { app, BrowserWindow } from 'electron';
import { join } from 'path';

app.setName('Ki Desktop Wallet Dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 810,
    minWidth: 1100,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  });

  /* if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else { */
  mainWindow.loadFile(join(app.getAppPath(), '..', 'renderer', 'index.html'));
  // }

  return mainWindow;
}

function createSplash() {
  const splashScreen = new BrowserWindow({
    minWidth: 280,
    minHeight: 500,
    width: 280,
    height: 500,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    frame: false,
    skipTaskbar: true,
    resizable: false,
    alwaysOnTop: true,
    show: true,
  });
  splashScreen.loadFile('static/splashscreen.html');
  return splashScreen;
}

let mainWindow: BrowserWindow;
let splashScreen: BrowserWindow;

function createMainWindow() {
  mainWindow = createWindow();
  splashScreen = createSplash();

  mainWindow.once('ready-to-show', () => {
    splashScreen.destroy();
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadFile(join(app.getAppPath(), '..', 'renderer', 'index.html'));
  });
}

app.once('ready', createMainWindow);

app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
