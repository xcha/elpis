const Koa = require('koa')
const path = require('path')
const { sep } = path //兼容不同操作系统上的斜杠
const env = require('./env')

const configLoader = require('./loader/config')
const extendLoader = require('./loader/extend')
const middlewareLoader = require('./loader/middleware')
const serviceLoader = require('./loader/service')
const routerSchemaLoader = require('./loader/router-schema')
const controllerLoader = require('./loader/controller')
const routerLoader = require('./loader/router')

module.exports = {
  /**
   * 启动服务
   * @param {Object} options - 项目配置
      options = {
          name //项目名称
          homePage //项目首页
      }
   */
  start(options = {}) {
    // koa 实例
    const app = new Koa()
    // 应用配置
    app.options = options

    // 基础路径
    app.baseDir = process.cwd()

    // 业务文件路径
    app.bussinessPath = path.resolve(app.baseDir, `.${sep}app`)
    console.log(`-- [start] bussinessPath: ${app.bussinessPath} --`)

    // 初始化环境变量
    app.env = env()
    console.log(`-- [start] env: ${app.env.get()} --`)

    // 加载 config
    configLoader(app)
    console.log(`-- [start] load config done --`)

    // 加载 extend
    extendLoader(app)
    console.log(`-- [start] load extend done --`)

    // 加载 routerSchema
    routerSchemaLoader(app)
    console.log(`-- [start] load routerSchema done --`)

    // 加载 middleware
    middlewareLoader(app)
    console.log(`-- [start] load middleware done --`)

    // 加载 service
    serviceLoader(app)
    console.log(`-- [start] load service done --`)

    // 加载 controller
    controllerLoader(app)
    console.log(`-- [start] load controller done --`)

    // 注册 elpis 全局中间件
    require(path.resolve(__dirname, `..${sep}app${sep}middleware.js`))(app)
    console.log(`-- [start] load global elpis middleware done --`)

    // 注册业务全局中间件
    try {
      require(`${app.bussinessPath}${sep}middleware.js`)(app)
      console.log(`-- [start] load global bussiness middleware done --`)
    } catch (err) {
      console.log('[exception] there is no global bussiness middleware.js file.')
    }

    // 注册路由
    routerLoader(app)
    console.log(`-- [start] load router done --`)

    // 启动服务
    try {
      const port = process.env.PORT || 8088
      const host = process.env.IP || '0.0.0.0'
      app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`)
      })
    } catch (err) {
      console.log(err)
    }
    return app
  }
}
