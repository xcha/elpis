//本地开发启动devServer
const express = require("express");
const path = require("path");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const consoler = require("consoler");
const app = express();

// 从webpack.dev.js获取webpack配置的devServer配置
const {
  // webpack 配置
  webpackConfig,
  // devServer 配置
  DEV_SERVER_CONFIG,
} = require("./config/webpack.dev.js");

const compiler = webpack(webpackConfig);

// 指定静态文件目录
app.use(express.static(path.join(__dirname, "./app/public/dist")));

// 引用webpack-dev-middleware(监控文件改动)
app.use(
  devMiddleware(compiler, {
    writeToDisk: (filePath) => {
      return filePath.endsWith(".tpl");
    },
    publicPath: webpackConfig.output.publicPath,

    headers: {
      "Access-Control-Allow-Origin": "*", // 允许所有来源
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, Content-Type, Authorization",
    },
    stats: {
      colors: true,
    },
  }),
);
// 引用webpack-hot-middleware(实现热更新通讯)
app.use(
  hotMiddleware(compiler, {
    path: `${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {},
  }),
);

consoler.info(`请等待webpack初次构建完成提示....`);

const port = DEV_SERVER_CONFIG.PORT;

//启动app
app.listen(port, () => {
  consoler.info(`devServer 启动在 http://${DEV_SERVER_CONFIG.HOST}:${port}`);
});
