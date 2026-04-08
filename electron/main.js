const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let win, tray, backendProcess;

function startBackend() {
  backendProcess = spawn('node', [path.join(__dirname, '../backend/server.js')], {
    cwd: path.join(__dirname, '../backend'),
    shell: true,
  });
  backendProcess.stdout.on('data', d => console.log(`Backend: ${d}`));
  backendProcess.stderr.on('data', d => console.error(`Backend Error: ${d}`));
}

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

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});