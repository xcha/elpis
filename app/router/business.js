module.exports = (app, router) => {
  const { business: businessController } = app.controller;
  router.get(
    "/api/product/list",
    businessController.getList.bind(businessController),
  );

  router.delete(
    "/api/product",
    businessController.remove.bind(businessController),
  );
};
