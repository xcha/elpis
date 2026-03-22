const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
/**
 * 生产环境配置
 */

const webpackConfig = merge.smart(baseConfig, {
  mode: "production",
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
});
module.exports = webpackConfig;
