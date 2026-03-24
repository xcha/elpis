const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const HappyPack = require("happypack");
const os = require("os");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserPlugin = require("terser-webpack-plugin");

//多线程buila设置
const happyPackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};

const webpackConfig = merge.smart(baseConfig, {
  mode: "production",
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "happypack/loader?id=css"],
      },
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), "./app/pages")],
        use: "happypack/loader?id=js",
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    //每次bulld前.清空pablic/dist目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: true,
    }),
    //提取css的公共部分，有效利用缀存，[非公共部分使用inline]
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].bundle.css",
    }),
    //优化井压缩css密源
    new CSSMinimizerPlugin(),
    //多线程打包JS:加快打包速度
    new HappyPack({
      ...happyPackCommonConfig,
      id: "js",
      loaders: [
        {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: false }]],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      ],
    }),
    //多线程打包C55：加快打包速度
    new HappyPack({
      ...happyPackCommonConfig,
      id: "css",
      loaders: [
        {
          path: "css-loader",
          options: { importLoaders: 1 },
        },
      ],
    }),
    //浏篮器在请求资源时不发送用户的身份凭证
    // 由于 Webpack 5 的 output.crossOriginLoading 已能处理此需求，该插件已冗余。
    // new HtmlWebpackInjectAttributesPlugin({
    //   attributes: {
    //     crossorigin: "anonymous",
    //   },
    // }),
  ],
  optimization: {
    // 使用TeresrPlugin的并发和缓存
    // 清理console.log输出
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true, //缓存加速构建
        parallel: true, // 多核CPU并行
        terserOptions: {
          compress: {
            drop_console: true, // 清除console
          },
        },
      }),
    ],
  },
});
module.exports = webpackConfig;
