const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * controller loader
 * @param {object} app  Koa 实例
 * 
 * 加载所有 controller，可通过 'app.controller.${目录}.${文件}' 访问
 * 
    例子：
    app/controller
        丨 -- custom-module
                |  -- custom-controller.js
    
    => app.controller.customModule.customController
 * 
 */
module.exports = (app) => {
  const controller = {}

  // 读取 elpis/app/controller/**/**.js 下所有文件
  const elpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`)
  const elpisFileList = glob.sync(path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`))
  elpisFileList.forEach((file) => handleFile(file))

  // 读取 业务根目录/app/controller/**/**.js 下所有文件
  const bussinessControllerPath = path.resolve(app.bussinessPath, `.${sep}controller`)
  const bussinessFileList = glob.sync(path.resolve(bussinessControllerPath, `.${sep}**${sep}**.js`))
  bussinessFileList.forEach((file) => handleFile(file))

  // 把内容加载到 app.controller 下
  function handleFile(file) {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(`.`)
    )
    // 把 '-' 统一改成驼峰式， custom-module/custom-controller => customModule.customController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 controller 到内存 app 对象中
    let tempController = controller
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      const name = names[i]
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app)
        tempController[name] = new ControllerModule()
      } else {
        if (!tempController[name]) {
          tempController[name] = {}
        }
        tempController = tempController[name]
      }
    }
  }

  app.controller = controller
}
