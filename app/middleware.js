const path = require("path");

module.exports = (app) => {
  const koaStatic = require("koa-static");
  app.use(koaStatic(path.resolve(process.cwd(), "./app/public")));

  //模版渲染引擎
  const koaNunjucks = require("koa-nunjucks-2");
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        trimBlocks: true, //删除块结束标签后的换行符
        noCache: true, // 禁用缓存，每次请求都重新渲染模板
      },
    }),
  );

  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      formList: "1000mb",
      enableTypes: ["json", "form", "text"],
    }),
  );
};
