const md5 = require('md5')

/**
 * API 签名合法性校验
 */
module.exports = (app) => async (ctx, next) => {
  // 校验白名单
  if (app.config?.apiSignVerify?.whiteList?.includes(ctx.path)) {
    return await next()
  }

  // 只对api请求进行签名校验
  if (!ctx.path.startsWith('/api')) {
    return await next()
  }

  const { path, method } = ctx
  const { headers } = ctx.request
  const { s_sign: sSign, s_t: st } = headers

  const signKey = 'b4f00857d45ea9ea2ec28cbf43b3c543'
  const signature = md5(`${signKey}_${st}`)

  app.logger.info(`[${method} ${path}] signature: ${signature}`)

  const expired = Date.now() - st > 1000 * 60 // 1分钟过期

  if (!sSign || !st || signature !== sSign.toLowerCase() || expired) {
    ctx.status = 200
    ctx.body = {
      success: false,
      code: 445,
      message: expired ? 'signature expired!!!' : 'signature not valid!!!'
    }
    return
  }
  await next()
}
