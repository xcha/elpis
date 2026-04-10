const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * service loader
 * @param {object} app  Koa 实例
 * 
 * 加载所有 service，可通过 'app.service.${目录}.${文件}' 访问
 * 
    例子：
    app/service
        丨 -- custom-module
                |  -- custom-service.js
    
    => app.service.customModule.customService
 * 
 */
module.exports = (app) => {
  const service = {}

  // 读取 elpis/app/service/**/**.js 下所有文件
  const elpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}service`)
  const elpisFileList = glob.sync(path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`))
  elpisFileList.forEach((file) => handleFile(file))

  // 读取 业务根目录/app/service/**/**.js 下所有文件
  const bussinessControllerPath = path.resolve(app.bussinessPath, `.${sep}service`)
  const bussinessFileList = glob.sync(path.resolve(bussinessControllerPath, `.${sep}**${sep}**.js`))
  bussinessFileList.forEach((file) => handleFile(file))

  // 把内容加载到 app.service 下
  function handleFile(file) {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(`.`)
    )
    // 把 '-' 统一改成驼峰式， custom-module/custom-service => customModule.customService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 service 到内存 app 对象中
    let tempService = service
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      const name = names[i]
      if (i === len - 1) {
        const ServiceModule = require(path.resolve(file))(app)
        tempService[name] = new ServiceModule()
      } else {
        if (!tempService[name]) {
          tempService[name] = {}
        }
        tempService = tempService[name]
      }
    }
  }
  app.service = service
}
