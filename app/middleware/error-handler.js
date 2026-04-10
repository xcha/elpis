/**
 * 运行时异常错误处理，兜底所有异常
 * @param {object} app koa 实例
 */
module.exports = (app) => async (ctx, next) => {
  try {
    await next()

    // 处理404错误（如果路由没有匹配到任何处理器）
    if (ctx.status === 404) {
      // 判断是否为API请求
      if (ctx.path.startsWith('/api/')) {
        ctx.body = {
          success: false,
          code: 40400,
          message: '接口不存在',
          path: ctx.path,
          method: ctx.method
        }
      } else {
        // 页面404处理
        ctx.body = {
          success: false,
          code: 40400,
          message: '页面不存在',
          path: ctx.path
        }
      }
      return
    }
  } catch (err) {
    // 统一处理错误
    const { status, message, detail } = err
    app.logger.info(JSON.stringify(err))
    app.logger.error('[-- exception --]:', err)
    app.logger.error('[-- exception --]:', status, message, detail)

    if (message && message.indexOf('template not found') > -1) {
      //页面重定向
      ctx.status = 302 //临时重定向
      ctx.redirect(`${app.options?.homePage ?? '/'}`)
      return
    }

    // 处理404错误
    if (status === 404) {
      ctx.status = 404
      if (ctx.path.startsWith('/api/')) {
        ctx.body = {
          success: false,
          code: 40400,
          message: '接口不存在',
          path: ctx.path,
          method: ctx.method
        }
      } else {
        ctx.body = {
          success: false,
          code: 40400,
          message: '页面不存在',
          path: ctx.path
        }
      }
      return
    }

    ctx.status = 200
    ctx.body = {
      success: false,
      code: 50000,
      message: message ?? '网络异常，请稍后重试！'
    }
  }
}
