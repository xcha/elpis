const glob = require("glob");
const path = require("path");
const { sep } = path; // 操作系统路径分隔符（如 Windows 为 "\\"，类 Unix 为 "/"）

module.exports = (app) => {
  // 计算业务目录下 controller 文件夹的绝对路径
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
  // 递归匹配 controller 目录中的所有 .js 文件
  const fileList = glob.sync(
    path.resolve(controllerPath),
    `.${sep}**${sep}**.js`,
  );
  // 用于按目录结构组织并存放所有中间件
  const controllers = {};
  fileList.forEach((file) => {
    // 将绝对路径转换为相对名称：去掉 "controller/" 前缀与 ".js" 后缀
    let name = path.resolve(file);
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf("."),
    );
    // 规范名称为 camelCase：把下划线/中划线后的字母转为大写（支持大小写匹配与全局替换）
    name = name.replace(/[_-][a-z]/gi, (match) =>
      match.substring(1).toUpperCase(),
    );

    // 按路径层级构造嵌套对象，并挂载中间件到内存 app 对象
    let tempcontroller = controllers;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app);
        tempcontroller[name[i]] = new ControllerModule();
      } else {
        if (!tempcontroller[name[i]]) {
          tempcontroller[name[i]] = {};
          tempcontroller = tempcontroller[name[i]];
        }
      }
    }
  });
  // 将已组织的中间件集合暴露到 app 对象上
  app.controllers = controllers;
};
