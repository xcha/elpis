// 基类配置
const path = require('path')
const merge = require('webpack-merge')
const os = require('os')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')
const TerserPlugin = require('terser-webpack-plugin')

//多线程打包JS、CSS
const threadLoader = {
  loader: require.resolve('thread-loader'),
  options: {
    workers: os.cpus().length, // 根据 CPU 核心数设置线程数
    workerParallelJobs: 50, // 每个线程并行任务数
    poolTimeout: 2000 // 线程空闲时的超时时间
  }
}

const baseConfig = require('./webpack.base.js')

// 生产环境配置
const webpackConfig = merge.smart(baseConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), 'app/public/dist/prod/'),
    publicPath: '/dist/prod/',
    crossOriginLoading: 'anonymous'
  },
  module: {
    rules: [
      // 模块化 CSS|LESS
      {
        test: /\.module\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: { localIdentName: '[hash:base64:8]' }
            }
          },
          require.resolve('less-loader')
        ]
      },
      // 普通 CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')]
      },
      // 普通 LESS
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('less-loader')
        ]
      },
      {
        test: /\.js$/,
        include: [
          // 处理 elpis 目录
          path.resolve(__dirname, '../../pages'),
          // 处理 业务 目录
          path.resolve(process.cwd(), './pages')
        ],
        use: [threadLoader, require.resolve('babel-loader')]
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    //每次 build 前，清空 public/dist 目录
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(process.cwd(), 'app/public/dist')],
      verbose: true,
      dry: false
    }),
    //提取 css 的公共部分，有效利用缓存
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[name]_[contenthash:8].bundle.css'
    }),
    //浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: 'anonymous'
    })
  ],
  optimization: {
    //使用 TerserPlugin 的并发，提升压缩阶段的性能
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      //优化并压缩 css 资源
      new CssMinimizerWebpackPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        }
      })
    ]
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename] // 将当前配置文件作为构建依赖
    }
  }
})

module.exports = webpackConfig
