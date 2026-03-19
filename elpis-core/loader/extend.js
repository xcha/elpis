const glob = require("glob");
const path = require("path");
const { sep } = path; // 操作系统路径分隔符（如 Windows 为 "\\"，类 Unix 为 "/"）

module.exports = (app) => {
  // 计算业务目录下 extend 文件夹的绝对路径
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
  // 递归匹配 extend 目录中的所有 .js 文件
  const fileList = glob.sync(path.resolve(extendPath), `.${sep}**${sep}**.js`);
  fileList.forEach((file) => {
    // 将绝对路径转换为相对名称：去掉 "extend/" 前缀与 ".js" 后缀
    let name = path.resolve(file);
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf("."),
    );
    // 规范名称为 camelCase：把下划线/中划线后的字母转为大写（支持大小写匹配与全局替换）
    name = name.replace(/[_-][a-z]/gi, (match) =>
      match.substring(1).toUpperCase(),
    );

    // 加载扩展模块
    const extension = require(path.resolve(file))(app);

    // 将扩展内容直接合并到 app 对象上，而不是嵌套在 app.extends 下
    if (typeof extension === "object" && extension !== null) {
      Object.assign(app, extension);
    } else {
      // 如果导出的是单个属性或函数，则按文件名挂载
      app[name] = extension;
    }
  });
};
