const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('api', {
  addOne: () => ipcRenderer.invoke('addOne'),
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('ops', {
  runOperation: (n1:number,n2:number,op:string) => ipcRenderer.invoke('runOps', {n1,n2,op})
})

contextBridge.exposeInMainWorld('sents', {
  count: (sent:string) => ipcRenderer.invoke('countWords', sent)
})
