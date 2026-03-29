module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    get(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;

      if (!projConfig) {
        this.fail(ctx, "获取项目异常", 50000);
        return;
      }
      this.success(ctx, projConfig);
    }

    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();

      const dtoModelList = modelList.reduce((prev, cur) => {
        const { model, project } = cur;

        //构造model关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        //构造project关键数据
        const dtoProject = Object.keys(project).reduce((preobj, projKey) => {
          const { key, name, desc, homePage } = project[projKey];
          preobj[projKey] = { key, name, desc, homePage };
          return preobj;
        }, {});

        // 整合返回结构
        prev.push({
          model: dtoModel,
          project: dtoProject,
        });

        return prev;
      }, []);

      this.success(ctx, dtoModelList);
    }

    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;
      const projectList = await projectService.getList({ projKey });

      //构造关键数据list
      const dtoProjectList = projectList.map((item) => {
        const { modelKey, key, name, desc, homePage } = item;
        return {
          modelKey,
          key,
          name,
          desc,
          homePage,
        };
      });

      this.success(ctx, dtoProjectList);
    }
  };
};
