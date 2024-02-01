const pm2 = require("pm2");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const createWindow = () => {
  createJavaServer();
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.webContents.openDevTools(); //打开调试工具
  win.loadFile("./src/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("node-red-message", (event, arg) => {
  console.log(arg);
  nodeRedHandle(event, arg);
});
ipcMain.on("java-message", (event, arg) => {
  console.log(arg);
  javaHandle(event, arg);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function createJavaServer() {
  pm2.connect((err) => {
    if (err) {
      console.log(err);
    }
    pm2.start(
      {
        name: "java",
        script: "./jar/start.sh",
        cwd: path.join(__dirname),
        error: "./pm2javaLog/err.log",
        output: "./pm2javaLog/out.log",
      },
      function (err, app) {
        if (err) throw err;
      }
    );
    pm2.start(
      {
        script: "./server.js",
        cwd: path.join(__dirname),
        name: "node-red",
        output: "./pm2log/out.log",
        error: "./pm2log/err.log",
      },
      function (err, app) {
        if (err) throw err;
      }
    );
  });
}

function nodeRedHandle(event, type) {
  // 启动node-red服务
  pm2[type]("node-red", function (err, app) {
    event.reply("node-red-listener", app);
    if (err) throw err;
  });
}

function javaHandle(event, type) {
  // 启动node-red服务
  pm2[type]("java", function (err, app) {
    event.reply("java-listener", app);
    if (err) throw err;
  });
}
ipcMain.on("pm2-kill", (event, arg) => {
  console.log("停止服务");
  pm2.stop("java", function (err, app) {
    pm2.disconnect();
    event.reply("java-listener", app);
    if (err) throw err;
  });
});
