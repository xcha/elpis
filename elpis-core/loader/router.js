const KoaRouter = require("koa-router");
const path = require("path");
const { sep } = path;
const glob = require("glob");

/**
 *
 * @param {object} app koa实例
 * 解析所有app/router目录下的路由文件 挂载到koa实例的router属性上
 *  */

module.exports = (app) => {
  // 找到路由文件路径
  const routerPath = path.resolve(app.businessPath, "router");
  // 实例化 KoaRouter
  const router = new KoaRouter();
  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `${sep}**${sep}*.js`));
  fileList.forEach((file) => {
    const routerFile = require(file)(app, router);
  });
  // 路由兜底
  router.get("*", async (ctx, next) => {
    ctx.status = 302;
    ctx.redirect(`${app?.options?.homePath ?? "/"}`);
  });

  // 挂载路由
  app.use(router.routes());
  // 挂载路由中间件
  app.use(router.allowedMethods());
};
