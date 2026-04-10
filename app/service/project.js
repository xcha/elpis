module.exports = (app) => {
  const BaseService = require('./base')(app)
  const modelList = require('../../model/index.js')(app)
  return class ProjectService extends BaseService {
    /**
     * 根据 projKey 获取项目配置
     */
    get(projKey) {
      for (const { project } of modelList) {
        if (project[projKey]) {
          return project[projKey]
        }
      }
      return undefined
    }

    /**
     * 获取当前 projKey 对应模型下的项目列表（如果无 projKey 则全量获取）
     */
    getList({ projKey }) {
      return modelList.flatMap(({ project }) => {
        if (projKey && !project[projKey]) return []
        return Object.values(project)
      })
    }

    /**
     * 获取所有模型与项目的结构化数据
     */
    getModelList() {
      return modelList
    }
  }
}
