module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      console.log(projKey, "~~~~~~");
      const { project: projectService } = app.service;
      const projectList = await projectService.getList();
      this.success(ctx, projectList);
    }
  };
};
