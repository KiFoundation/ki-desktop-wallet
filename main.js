const setupEvents = require('./installers/config/windows/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const electron = require("electron");
const ipc = require("electron").ipcMain;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // backgroundColor: '#043bea',
    width: 1200,
    height: 950,
    minWidth: 1200,
    minWidth: 900,
    show: false,
    // frame:false,
    // titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, "assets/icons/mac/icon.icns"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // mainWindow.openDevTools();
  // Open all target="_blank" link in external browser
  let webContents = mainWindow.webContents;
  webContents.on("new-window", function (event, url) {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createSplash() {
  splashScreen = new BrowserWindow({
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
  });
  splashScreen.loadFile("splashscreen.html");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)

app.on("ready", function () {
  createWindow();
  createSplash();
});

// // Quit when all windows are closed.
// app.on('window-all-closed', function() {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') app.quit()
// })

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipc.on("showMainWindow", () => {
  splashScreen.destroy();
  BrowserWindow.getAllWindows()[0].show();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
