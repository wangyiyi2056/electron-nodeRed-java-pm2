// 引入 Node-RED 运行环境
const RED = require("node-red");

// 创建一个 Express app
const express = require("express");
const app = express();
let flag = true;

if (flag) {
  createExpressServer();
  flag = false;
}

function createExpressServer() {
  // 添加静态文件的路由，放置在 'public' 文件夹下
  app.use("/", express.static("public"));

  console.log("执行了node-red启动函数");
  // 创建服务器
  const server = require("http").createServer(app);

  // 配置 Node-RED 的运行设置
  let settings = {
    httpAdminRoot: "/",
    httpNodeRoot: "/api",
    userDir: "$HOME/.node-red",
    functionGlobalContext: {}, // 为函数节点提供全局变量
    editorTheme: {
      page: {
        title: "蜜蜂指令设计器",
        favicon: "/absolute/path/to/theme/icon",
        // css: "/absolute/path/to/custom/css/file",
        // scripts: [ "/absolute/path/to/custom/script/file", "/another/script/file"]
      },
      header: {
        title: "蜜蜂指令设计器",
        // image: "/absolute/path/to/header/image", // or null to remove image
        // url: "http://nodered.org" // optional url to make the header text/image a link to this url
      },
      deployButton: {
        type: "simple",
        label: "发布",
        icon: "/absolute/path/to/deploy/button/image", // or null to remove image
      },
      // baseApi: `http://127.0.0.1:10301`,
    },
  };

  // 使用服务器和设置来初始化运行环境
  RED.init(server, settings);

  // 在路由/url "/red" 下提供 Node-RED 编辑器 UI
  app.use(settings.httpAdminRoot, RED.httpAdmin);

  // 在路由/url "/api" 下提供 Node-RED http 节点 UI
  app.use(settings.httpNodeRoot, RED.httpNode);

  server.listen(3000, () => {
    console.log("NODE_RED 服务已经启动，端口号为3000.");
  });

  // 启动 Node-RED 运行环境
  RED.start();
}
