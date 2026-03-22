const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
/**
 * 生产环境配置
 */

const webpackConfig = merge.smart(baseConfig, {
  mode: "development",
  output: {},
});
module.exports = webpackConfig;
