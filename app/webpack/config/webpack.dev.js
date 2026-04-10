// 基类配置
const path = require('path')
const merge = require('webpack-merge')
const os = require('os')
const webpack = require('webpack')

//基础配置
const baseConfig = require('./webpack.base.js')

//devServer配置
const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '__webpack_hmr',
  TIMEOUT: 20000
}

//开发阶段的 entry 配置需要加入的hmr
Object.keys(baseConfig.entry).forEach((entryName) => {
  if (entryName !== 'vendor') {
    baseConfig.entry[entryName] = [
      //主入口
      baseConfig.entry[entryName],
      //hmr更新入口
      `${require.resolve('webpack-hot-middleware/client')}?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
    ]
  }
})

//多线程打包JS、CSS
const threadLoader = {
  loader: require.resolve('thread-loader'),
  options: {
    workers: os.cpus().length - 1, // 根据 CPU 核心数设置线程数，以保留一个核心用于其他任务
    workerParallelJobs: 20, // 每个线程并行任务数，设置为较低的值，以减少每个线程的负载
    poolTimeout: 5000 // 线程空闲时的超时时间，设置为较长的时间，以便在频繁的代码更改时，线程池不需要频繁地创建和销毁
  }
}

// 生产环境配置
const webpackConfig = merge.smart(baseConfig, {
  mode: 'development',
  //source-map 开发工具，呈现代码的映射关系，便于在开发过程中调试代码
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/dev/'), // 输出路径
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`, // 静态资源访问路径（在devServer内存中）
    globalObject: 'this'
  },
  module: {
    rules: [
      // 模块化 CSS|LESS
      {
        test: /\.module\.(css|less)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: { localIdentName: '[name]__[local]___[hash:base64:5]' }
            }
          },
          require.resolve('less-loader')
        ]
      },
      // 普通 CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')]
      },
      // 普通 LESS
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          require.resolve('style-loader'),
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
  plugins: [
    //  HMR热更新
    new webpack.HotModuleReplacementPlugin({
      multiStep: false
    })
  ]
})

module.exports = { webpackConfig, DEV_SERVER_CONFIG }
