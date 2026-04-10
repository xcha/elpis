/**
 * 后端工具函数
 */

/**
 * 成功响应
 * @param {object} ctx Koa上下文
 * @param {any} data 数据
 * @param {string} message 消息
 */
const sendSuccess = (ctx, data = null, metadata = null) => {
  ctx.status = 200
  const body = {
    success: true,
    data
  }
  metadata && (body.metadata = metadata)
  ctx.body = body
}

/**
 * 错误响应
 * @param {object} ctx Koa上下文
 * @param {string} message 错误消息
 * @param {number} code 错误码
 * @param {any} data 错误数据
 */
const sendError = (ctx, message = '操作失败', code = 50000, data = null) => {
  ctx.status = 200
  ctx.body = {
    success: false,
    code,
    message,
    data
  }
}

/**
 * 处理API 404错误
 * @param {object} ctx Koa上下文
 * @param {string} path 请求路径
 * @param {string} method 请求方法
 */
const handleApi404 = (ctx, path, method, message = '资源不存在') => {
  ctx.status = 404
  ctx.body = {
    success: false,
    code: 40400,
    message,
    path,
    method
  }
}

/**
 * 处理页面404错误
 * @param {object} ctx Koa上下文
 * @param {string} path 请求路径
 */
const handlePage404 = (ctx, path) => {
  ctx.status = 404
  ctx.body = {
    success: false,
    code: 40400,
    message: '页面不存在',
    path
  }
}

/**
 * 检查是否为API请求
 * @param {string} path 请求路径
 * @returns {boolean}
 */
const isApiRequest = (path) => {
  return path.startsWith('/api/')
}

module.exports = {
  handleApi404,
  handlePage404,
  isApiRequest,
  sendSuccess,
  sendError
}
