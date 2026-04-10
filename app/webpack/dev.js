const webpack = require('webpack')
const express = require('express')
const consoler = require('consoler')
const path = require('path')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

module.exports = () => {
  const { webpackConfig, DEV_SERVER_CONFIG } = require('./config/webpack.dev.js')

  const app = express()

  const compiler = webpack(webpackConfig)

  //指定静态文件目录
  app.use(express.static(path.join(process.cwd(), './app/public/dist')))

  //引用 devMiddleware 中间件（监控文件改动）
  app.use(
    devMiddleware(compiler, {
      //落地文件
      writeToDisk: (filePath) => filePath.endsWith('.tpl'), // 页面模板（如 entry.page1.tpl）需要实际写入磁盘，通过 express.static 提供访问。
      //资源路径
      publicPath: webpackConfig.output.publicPath, // JS/CSS 等资源由 webpack-dev-middleware 托管在内存中，走 HMR 热更新。
      //headers配置
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      },
      stats: {
        colors: true
      }
    })
  )
  //引用 hotMiddleware 中间件（实现HMR）
  app.use(
    hotMiddleware(compiler, {
      path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
      log: false
    })
  )

  consoler.info('请等待webpack初次构建完成提示......')

  //启动 devServer
  const port = DEV_SERVER_CONFIG.PORT
  app.listen(port, () => {
    console.log(`webpack-dev-server is listening on port ${port}`)
  })
}
