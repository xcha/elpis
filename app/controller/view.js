module.exports = (app) => {
  const baseController = require("./base")(app);
  return class ViewController extends baseController {
    async renderPage(ctx) {
      const { query, params } = ctx.request;
      app.logger.info(`[ViewController] query: ${JSON.stringify(query)}`);
      app.logger.info(`[ViewController] params: ${JSON.stringify(params)}`);
      await ctx.render(`dist/entry.${ctx.params.page}`, {
        projKey: ctx.query?.proj_key,
        name: app.options?.name,
        env: app.env.get(),
        options: JSON.stringify(app.options),
      });
    }
  };
};
