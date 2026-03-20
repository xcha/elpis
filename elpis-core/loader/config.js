const glob = require("glob");
const path = require("path");
const { sep } = path; // 操作系统路径分隔符（如 Windows 为 "\\"，类 Unix 为 "/"）
/**
 * config loader
 * @param {*} app
 * 配置区分本地/测试/生产 通过 env 环境读取不同文件配置 evn.config
 * 通过 env.config 覆盖 default.config 加载到 app.config 中
 * 目录下对应的 config
 * 配置默人配置 config/config.default.js
 * 本地配置config/config.local.js
 * 测试配置config/config.beta.js
 * 生产配置 config/config.prod.js
 */

module.exports = (app) => {
  //找到confia/目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`);
  //获取 default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(
      path.resolve(configPath, `.${sep}config.default.js`),
    );
  } catch (e) {
    console.log(`加载默认config配置失败`);
  }

  //获取 env.config
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      //本地环境
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      //测试环境
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if (app.env.isProduction()) {
      //生产环境
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));
    }
    console.log(`加载${app.env.get()}环境config配置成功`, envConfig);
  } catch (e) {
    console.log(`加载config环境配置失败`);
  }

  //合并配置
  app.config = {
    ...defaultConfig,
    ...envConfig,
  };
};
