module.exports = (app) => {
  const baseController = require("./base")(app);
  return class BusinessController extends baseController {
    remove(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, {
        product_id: productId,
      });
    }
    getList(ctx) {
      this.success(
        ctx,
        [
          {
            product_id: "1",
            product_name: `${ctx.projKey} -《大前端面试宝典》`,
            price: 39.9,
            inventory: 99999,
            create_time: "2023-07-0320:23:22",
          },
          {
            product_id: "2",
            product_name: `${ctx.projKey} -《前端求职之道》`,
            price: 199,
            inventory: 1000000,
            create_time: "2024-07-03 20:23:22",
          },
          {
            product_id: "3",
            product_name: `${ctx.projKey} -《大前端实践》`,
            price: 899,
            inventory: 188,
            create_time: "2025-07-03 20:23:22",
          },
        ],
        {
          total: 3,
        },
      );
    }
  };
};
