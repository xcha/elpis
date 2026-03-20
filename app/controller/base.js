module.exports = (app) =>
  class BaseController {
    /**
     * 基类
     * 统一收拢controller的方法
     */
    constructor() {
      this.app = app;
      this.config = app.config;
      this.service = app.service;
    }

    success(ctx, data, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }

    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  };
