module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  // 正确写法：两个参数，用逗号分隔，但不要在外面套括号
  router.get(
    //注册 get路由
    "/api/project/model_list", // 路径
    projectController.getModelList.bind(projectController), // 处理函数 使用 .bind() 绑定 this
  );
};
