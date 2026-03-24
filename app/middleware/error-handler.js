module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const { status, message, detail } = err;
      app.logger.info(JSON.stringify(err));
      app.logger.error("[-- exception --]" + err);
      app.logger.error("[-- exception --]" + status, message, detail);

      if (message && message.indexOf("template not found") > -1) {
        ctx.status = 302;
        ctx.redirect(`${app.options?.homePage}`);
        return;
      }

      const resBody = {
        success: false,
        code: 50000,
        msg: "网络异常，请稍后再试",
      };
      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
