import path from 'path';
import { DatabaseService } from './services/database.service';
import { registerApiHandlers } from './ipc/api.handler';
import { registerOperationsHandlers } from './ipc/operations.handler';
import { registerSentencesHandlers } from './ipc/sentences.handler';

import { app, BrowserWindow } from 'electron';

app.commandLine.appendSwitch('remote-debugging-port', '9223');

const db = new DatabaseService();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  db.createTables();

  const isLocal = process.argv.includes('--local');
  const startURL = app.isPackaged || isLocal
    ? `file://${path.join(__dirname, '../renderer/browser/index.html')}`
    : 'http://localhost:4200';

  win.loadURL(startURL);
};

app.whenReady().then(() => {
  registerApiHandlers();
  registerOperationsHandlers();
  registerSentencesHandlers();
  createWindow();
});
