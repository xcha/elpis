const {
  handleApi404,
  handlePage404,
  isApiRequest,
  sendSuccess,
  sendError
} = require('../common/utils')

module.exports = (app) =>
  class BaseController {
    /**
     * controller 基类
     * 统一收拢 controller 相关的公共方法
     */
    constructor() {
      this.app = app
      this.config = app.config
      this.service = app.service
    }
    /**
     * API 处理成功时统一返回结构
     * @param {object} ctx 上下文
     * @param {object} data 核心数据
     * @param {object} metadata 附加数据
     * @returns
     */
    success(ctx, data, metadata) {
      sendSuccess(ctx, data, metadata)
    }
    /**
     * API 处理失败时统一返回结构
     * @param {object} ctx 上下文
     * @param {object} message 错误信息
     * @param {object} code 错误码
     * @param {any} data 错误数据
     * @returns
     */
    fail(ctx, message, code, data) {
      sendError(ctx, message, code, data)
    }
    /**
     * 处理API 404错误
     * @param {object} ctx Koa上下文
     * @param {string} path 请求路径
     * @param {string} method 请求方法
     */
    handleApi404(ctx, path, method) {
      handleApi404(ctx, path, method)
    }
    /**
     * 处理页面404错误
     * @param {object} ctx Koa上下文
     * @param {string} path 请求路径
     */
    handlePage404(ctx, path) {
      handlePage404(ctx, path)
    }
    /**
     * 检查是否为API请求
     * @param {string} path 请求路径
     * @returns {boolean}
     */
    isApiRequest(path) {
      return isApiRequest(path)
    }
  }
