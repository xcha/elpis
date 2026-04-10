const Ajv = require('ajv')
const ajv = new Ajv()

/**
 * API 参数校验
 */
module.exports = (app) => async (ctx, next) => {
  const $schema = 'http://json-schema.org/draft-07/schema#'
  // 只对api请求做参数校验
  if (!ctx.path.startsWith('/api/')) {
    return await next()
  }

  // 获取请求参数
  const { query, body, headers } = ctx.request
  const { path, method, params } = ctx

  app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`)
  app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`)
  app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`)
  app.logger.info(`[${method} ${path}] headers: ${JSON.stringify(headers)}`)

  const schema = app.routerSchema[path]?.[method.toLowerCase()]

  if (!schema) return await next()

  let vaild = true

  // ajv 校验器
  let vaildate

  // 校验 body
  if (vaild && body && schema.body) {
    schema.body.$schema = $schema
    vaildate = ajv.compile(schema.body)
    vaild = vaildate(body)
  }

  // 校验 query
  if (vaild && query && schema.query) {
    schema.query.$schema = $schema
    vaildate = ajv.compile(schema.query)
    vaild = vaildate(query)
  }

  // 校验 params
  if (vaild && params && schema.params) {
    schema.params.$schema = $schema
    vaildate = ajv.compile(schema.params)
    vaild = vaildate(params)
  }

  // 校验 headers
  if (vaild && headers && schema.headers) {
    schema.headers.$schema = $schema
    vaildate = ajv.compile(schema.headers)
    vaild = vaildate(headers)
  }

  if (!vaild) {
    ctx.status = 200
    ctx.body = {
      success: false,
      code: 442,
      message: `request validate failed: ${ajv.errorsText(vaildate.errors)}`
    }
    return
  }
  await next()
}
