import path from 'path';
import { addOne } from './services/ApiService';
import { DatabaseService } from './database/DatabaseService';
import { calculateOperations } from './services/OperationService';
import { countWordsInSentence } from './services/SentenceService';
import { operator } from './database/types';

const { app, BrowserWindow, ipcMain } = require('electron')


app.commandLine.appendSwitch("remote-debugging-port", "9223");

const db = new DatabaseService();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


  db.createTables();

  const isLocal = process.argv.includes("--local")
  const startURL = app.isPackaged || isLocal ? `file://${path.join(__dirname, 'renderer', 'browser','index.html')}` : `http://localhost:4200`;

  //win.loadFile('../src/index.html')
  win.loadURL(startURL)


}

app.whenReady().then(() => {
  ipcMain.handle('addOne', ()=>addOne())
  ipcMain.handle('runOps', (_event:any, arg:{n1:number,n2:number,op:string})=>calculateOperations(arg.n1, arg.n2, arg.op as operator))
  ipcMain.handle('countWords', (_event:any, sent:string)=>countWordsInSentence(sent))
  createWindow()
})

//turns off source maps in devtools, potentially fixes an issue where devtools take a while to open
//app.on("browser-window-created", (_:any, win: typeof BrowserWindow) => {
//  win.webContents.on("devtools-opened", () => {
//    win.webContents.executeJavaScript(`
//      DevToolsAPI.setUseSourceMaps(false);
//    `);
//  });
//});










