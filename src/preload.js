const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("API", {
  javaMessage: (type) => ipcRenderer.send("java-message", type),
  javaListener: (fun) =>
    ipcRenderer.on("java-listener", (event, arg) => {
      fun(arg);
    }),

  nodeRedMessage: (type) => ipcRenderer.send("node-red-message", type),

  nodeRedListener: (fun) =>
    ipcRenderer.on("node-red-listener", (event, arg) => {
      fun(arg);
    }),
  pm2Kill: () => ipcRenderer.send("pm2-kill"),
});
