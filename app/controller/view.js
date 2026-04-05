module.exports = (app) => {
  const baseController = require("./base")(app);
  return class ViewController extends baseController {
    async renderPage(ctx) {
      await ctx.render(`dist/entry.${ctx.params.page}`, {
        name: app.options?.name,
        env: app.env.get(),
        options: JSON.stringify(app.options),
      });
    }
  };
};
