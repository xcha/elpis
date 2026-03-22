const log4js = require("log4js");

module.exports = (app) => {
  let logger;
  if (app.env.isLocal()) {
    //本地环境 打印到控制台即可
    logger = console;
  } else {
    //其他环境 落地到磁盘
    log4js.configure({
      appenders: {
        console: {
          type: "console",
        },
        dataFile: {
          type: "dateFile",
          filename: "./logs/application.log",
          pattern: ".yyyy-MM-dd",
        },
      },
      categories: {
        default: {
          appenders: ["console", "dataFile"],
          level: "trace",
        },
      },
    });
    logger = log4js.getLogger();
  }
  return logger;
};
