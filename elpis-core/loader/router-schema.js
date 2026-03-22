/**
 * 加载路由schema
 * @param {object} app koa实例
 *  通过json-schema ajv对api规则约束配合 api-params-validator 对api参数进行校验
 */

const path = require("path");
const { sep } = path;
const glob = require("glob");

module.exports = (app) => {
  //读取app/router-schema/**/**.js下所有的文件
  const routerSchemaPath = path.resolve(
    app.businessPath,
    `.${sep}router-schema`,
  );
  const fileList = glob.sync(path.join(routerSchemaPath, `**${sep}*.js`));

  //注册所有routerSchema,使得可以app.routerSchema'这样访问
  let routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
