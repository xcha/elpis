const Koa = require("koa");
const path = require("path");
const { sep } = path;
const env = require("./env");

const middlewareLoader = require("./loader/middleware");
const routerSchemaLoader = require("./loader/router-schema");
const routerLoader = require("./loader/router");
const controllerLoader = require("./loader/controller");
const serviceLoader = require("./loader/service");
const configLoader = require("./loader/config");
const extendLoader = require("./loader/extend");

module.exports = {
  start(options = {}) {
    const app = new Koa();
    app.options = options;
    app.baseDir = process.cwd(); //当前工作目录
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
    app.env = env();

    //加载middleware
    middlewareLoader(app);
    //加载routerSchema
    routerSchemaLoader(app);
    //加载controller
    controllerLoader(app);
    // 加载 service
    serviceLoader(app);
    //加载config
    configLoader(app);
    // 加载 extend
    extendLoader(app);
    //注册路由
    routerLoader(app);

    //注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
    } catch (e) {
      console.error("middleware.js not found");
    }

    // 启动服务
    try {
      const port = process.env.PORT || 8080;
      const host = process.env.IP || "0.0.0.0";
      app.listen(port, host);
      console.log(`Server runnin on port:${port}`);
    } catch (e) {
      console.error(e);
    }
  },
};
