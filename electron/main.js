const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: { nodeIntegration: false },
  });

  const isDev = !app.isPackaged;
  win.loadURL(isDev
    ? 'http://localhost:5173'
    : `file://${path.join(process.resourcesPath, 'frontend/dist/index.html')}`
  );

  win.on('closed', () => (win = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());