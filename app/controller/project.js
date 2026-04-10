module.exports = (app) => {
  const BaseController = require('./base')(app)
  return class ProjectController extends BaseController {
    constructor() {
      super()
    }
    get(ctx) {
      const { proj_key: projKey } = ctx.request.query
      const projConfig = this.service.project.get(projKey)

      if (!projConfig) {
        this.fail(ctx, '获取项目异常')
        return
      }

      this.success(ctx, projConfig)
    }
    /**
     * 获取当前 projKey 对应模型下的项目列表（如果无 projKey 则全量获取）
     */
    getList(ctx) {
      const { proj_key: projKey } = ctx.request.query
      const projectList = this.service.project.getList({ projKey })

      // 构造关键数据list
      const dtoProjectList = projectList.map(({ modelKey, key, name, desc, homePage }) => ({
        modelKey,
        key,
        name,
        desc,
        homePage
      }))

      this.success(ctx, dtoProjectList)
    }
    /**
     * 获取所有模型与项目的结构化数据
     */
    getModelList(ctx) {
      const modelList = this.service.project.getModelList()

      // 构造返回结果，只返回关键数据
      const dtoModelList = modelList.map((item) => {
        const { model, project } = item

        // 构造 model 关键数据
        const { key, name, desc } = model
        const dtoModel = { key, name, desc }

        // 构造 project 关键数据
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey]
          preObj[projKey] = { key, name, desc, homePage }
          return preObj
        }, {})

        // 整合返回结构
        return {
          model: dtoModel,
          project: dtoProject
        }
      })
      this.success(ctx, dtoModelList)
    }
  }
}
