const Ajv = require("ajv");
const ajv = new Ajv();

module.exports = (app) => {
  const $schema = "http://json-schema.org/draft-07/schema#";

  return async (ctx, next) => {
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { body, query, headers } = ctx.request;
    const { params, path, method } = ctx;

    app.logger.info(`[${method}] ${path} body: ${JSON.stringify(body)}`);
    app.logger.info(`[${method}] ${path} query: ${JSON.stringify(query)}`);
    app.logger.info(`[${method}] ${path} params: ${JSON.stringify(params)}`);
    app.logger.info(`[${method}] ${path} headers: ${JSON.stringify(headers)}`);

    const schema = app.routerSchema[path]?.[method.toLowerCase()];

    if (!schema) {
      app.logger.info(`[${method}] ${path} 无参数校验规则`);
      return await next();
    }

    let valid = true; // 校验结果初始化为 true

    let validate; // 校验函数

    // 校验 headers
    if (valid && headers && schema.headers) {
      schema.headers.$schema = $schema;
      validate = ajv.compile(schema.headers);
      valid = validate(headers);
    }

    // 校验 body
    if (valid && body && schema.body) {
      schema.body.$schema = $schema;
      validate = ajv.compile(schema.body);
      valid = validate(body);
    }

    // 校验 query
    if (valid && query && schema.query) {
      schema.query.$schema = $schema;
      validate = ajv.compile(schema.query);
      valid = validate(query);
    }

    // 校验 params
    if (valid && params && schema.params) {
      schema.params.$schema = $schema;
      validate = ajv.compile(schema.params);
      valid = validate(params);
    }

    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 442,
        msg: `参数校验失败 ${ajv.errorsText(validate.errors)}`,
      };
      return;
    }

    await next();
  };
};
