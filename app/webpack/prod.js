const webpack = require('webpack')
const webpackProdConfig = require('./config/webpack.prod.js')

module.exports = () => {
  console.log('\nBuilding...\n')

  webpack(webpackProdConfig, (err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    process.stdout.write(
      `${stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: true
      })}\n`
    )
  })
}
