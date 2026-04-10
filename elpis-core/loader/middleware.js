const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * middleware loader
 * @param {object} app  Koa 实例
 * 
 * 加载所有 middleware，可通过 'app.middlewares.${目录}.${文件}' 访问
 * 
    例子：
    app/middleware
        丨 -- custom-module
                |  -- custom-middleware.js
    
    => app.middlewares.customModule.customMiddleware
 * 
 */
module.exports = (app) => {
  const middlewares = {}

  // 读取 elpis/app/middleware/**/**.js 下所有文件
  const elpisMiddlewarePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}middleware`)
  const elpisFileList = glob.sync(path.resolve(elpisMiddlewarePath, `.${sep}**${sep}**.js`))
  elpisFileList.forEach((file) => handleFile(file))

  // 读取 业务根目录/app/middleware/**/**.js 下所有文件
  const businessMiddlewarePath = path.resolve(app.bussinessPath, `.${sep}middleware`)
  const businessFileList = glob.sync(path.resolve(businessMiddlewarePath, `.${sep}**${sep}**.js`))
  businessFileList.forEach((file) => handleFile(file))

  // 把内容加载到 app.middlewares 下
  function handleFile(file) {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径 app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf(`.`)
    )
    // 把 '-' 统一改成驼峰式， custom-module/custom-middleware => customModule.customMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 middleware 到内存 app 对象中
    let tempMiddleware = middlewares
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      const name = names[i]
      if (i === len - 1) {
        tempMiddleware[name] = require(path.resolve(file))(app)
      } else {
        if (!tempMiddleware[name]) {
          tempMiddleware[name] = {}
        }
        tempMiddleware = tempMiddleware[name]
      }
    }
  }

  app.middlewares = middlewares
}
