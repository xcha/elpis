const glob = require('glob')
const path = require('path')
const { sep } = path
const { set } = require('lodash')

/**
 * extend loader
 * @param {object} app  Koa 实例
 * 
 * 加载所有 extend，可通过 'app.${目录}.${文件}' 访问
 * 
    例子：
    app/extend
        丨 -- custom-module
                |  -- custom-extend.js
    
    => app.customModule.customExtend
 * 
 */
module.exports = (app) => {
  // 读取 elpis/app/extend/**.js 下所有文件
  const elpisExtendPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}extend`)
  const elpisFileList = glob.sync(path.resolve(elpisExtendPath, `.${sep}**${sep}**.js`))
  elpisFileList.forEach((file) => handleFile(file))

  // 读取 业务根目录/app/extend/**.js 下所有文件
  const bussinessExtendPath = path.resolve(app.bussinessPath, `.${sep}extend`)
  const bussinessFileList = glob.sync(path.resolve(bussinessExtendPath, `.${sep}**${sep}**.js`))
  bussinessFileList.forEach((file) => handleFile(file))

  // 把内容加载到 app 下
  function handleFile(file) {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径 app/extend/custom-module/custom-extend.js => custom-module/custom-extend
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf(`.`)
    )
    // 把 '-' 统一改成驼峰式，  custom-module/custom-extend => customModule.customExtend
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase()).replace(sep, '.')

    // 过滤app已经存在的key
    for (const key in app) {
      if (key === name) {
        console.log(`[${name}] is already exists in app, please check your extend file.`)
        return
      }
    }

    // 挂载 extend 到 app 上
    set(app, name, require(path.resolve(file))(app))
  }
}
