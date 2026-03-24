module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  // 正确写法：两个参数，用逗号分隔，但不要在外面套括号
  router.get(
    "/api/project/list",
    projectController.getList.bind(projectController),
  );
};
