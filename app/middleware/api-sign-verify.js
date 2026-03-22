const md5 = require("md5");
module.exports = (app) => {
  return async (ctx, next) => {
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;

    const signKey = "zdx20040921";
    const signature = md5(`${signKey}_${st}`);
    app.logger.info(`[${method}] ${path} signature:${signature}`);

    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > 600000
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: "签名错误或过期",
        code: 445,
      };
      return;
    }

    await next();
  };
};
