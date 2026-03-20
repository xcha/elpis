module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    async getList(ctx) {
      const { project: projectService } = app.service;
      const projectList = await projectService.getList();
      this.success(ctx, projectList);
    }
  };
};
