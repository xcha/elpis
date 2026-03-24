const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const webpack = require("webpack");

const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1",
  PORT: 9002,
  HMR_PATH: "/__webpack_hmr",
  TIMEOUT: 20000,
};

// 开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach((v) => {
  // 第三方包不作为 hmr 入口
  if (v !== "vendor") {
    baseConfig.entry[v] = [
      // 主入口文件
      baseConfig.entry[v],
      // hmr 更新入口，官方指定的 hmr 路径
      `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`,
    ];
  }
});

const webpackConfig = merge.smart(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/dev"),
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`,
    globalObject: "this",
  },
  // 开发阶段插件
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      // 开启 HMR 全局变量
      multiStep: false,
    }),
  ],
});
module.exports = {
  // webpack 配置
  webpackConfig,
  // devServer 配置
  DEV_SERVER_CONFIG,
};
