const KoaRouter = require('@koa/router')
const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * router loader
 * @param {object} app koa 实例
 *
 * 解析所有 app/router/ 下所有 js 文件，加载到 KoaRouter 下
 */
module.exports = (app) => {
  // 实例化 Koarouter
  const router = new KoaRouter()

  // 找到elpis路由文件路径
  const elpisRouterPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router`)
  const elpisFileList = glob.sync(path.resolve(elpisRouterPath, `.${sep}**${sep}**.js`))
  elpisFileList.forEach((file) => handleFile(file))

  // 找到业务路由文件路径
  const bussinessRouterPath = path.resolve(app.bussinessPath, `.${sep}router`)
  const bussinessFileList = glob.sync(path.resolve(bussinessRouterPath, `.${sep}**${sep}**.js`))
  bussinessFileList.forEach((file) => handleFile(file))

  // 注册所有路由
  function handleFile(file) {
    require(path.resolve(file))(app, router)
  }

  // 路由兜底（健壮性）
  router.get('(.*)', async (ctx, next) => {
    // 排除 Chrome DevTools 的特殊请求
    if (ctx.path === '/.well-known/appspecific/com.chrome.devtools.json') {
      return await next()
    }

    // 判断是否为API请求
    if (ctx.path.startsWith('/api/')) {
      // API接口404处理
      ctx.status = 404
      ctx.body = {
        success: false,
        code: 40400,
        message: '接口不存在',
        path: ctx.path,
        method: ctx.method
      } // 页面404日志
      app.logger.warn(`接口不存在: ${ctx.method} ${ctx.path}`, {
        userAgent: ctx.headers['user-agent'],
        ip: ctx.ip
      })
      return
    }
    // 页面404日志
    app.logger.warn(`404页面: ${ctx.method} ${ctx.path}`, {
      userAgent: ctx.headers['user-agent'],
      ip: ctx.ip
    })
    ctx.status = 302 //临时重定向
    ctx.redirect(`${app?.options?.homePage ?? '/'}`)
  })

  // 处理其他HTTP方法的404
  router.all('(.*)', async (ctx, next) => {
    // 排除 Chrome DevTools 的特殊请求
    if (ctx.path === '/.well-known/appspecific/com.chrome.devtools.json') {
      return await next()
    }

    // 判断是否为API请求
    if (ctx.path.startsWith('/api/')) {
      // API接口404处理
      ctx.status = 404
      ctx.body = {
        success: false,
        code: 40400,
        message: '接口不存在',
        path: ctx.path,
        method: ctx.method
      }
      return
    }

    // 页面请求404处理
    ctx.status = 404
    ctx.body = {
      success: false,
      code: 40400,
      message: '页面不存在',
      path: ctx.path
    }
  })

  // 路由注册到 app 上
  app.use(router.routes())
  app.use(router.allowedMethods())
}
