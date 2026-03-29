module.exports = (app, router) => {
  const { project: projectController } = app.controller;

  router.get(
    "/api/project",
    projectController.getProject.bind(projectController),
  );

  router.get(
    "/api/project/list",
    projectController.getList.bind(projectController),
  );

  router.get(
    //注册 get路由
    "/api/project/model_list", // 路径
    projectController.getModelList.bind(projectController), // 处理函数 使用 .bind() 绑定 this
  );
};
