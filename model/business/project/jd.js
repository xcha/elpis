module.exports = {
  name: "京东",
  desc: "京东电商系统",
  homePage: "/schema?proj_key=jd&key=product",
  menu: [
    {
      key: "shop-setting",
      name: "店铺设置",
      menuType: "group",
      subMenu: [
        {
          key: "info-setting",
          name: "店铺信息",
          menutType: "module",
          moduleType: "custom",
          customConfig: {
            path: "/todo",
          },
        },
        {
          key: "quality-setting",
          name: "店铺资质",
          menutType: "module",
          moduleType: "iframe",
          iframeConfig: {
            path: "https://www.bilibili.com",
          },
        },
        {
          key: "categories",
          name: "分类数据",
          menuType: "group",
          subMenu: [
            {
              key: "category-1",
              name: "一级分类",
              menuType: "module",
              moduleType: "custom",
              customConfig: { path: "/todo" },
            },
            {
              key: "category-2",
              name: "二级分类",
              menuType: "module",
              moduleType: "iframe",
              iframeConfig: {
                path: "https://www.bilibili.com",
              },
            },
            {
              key: "tags",
              name: "标签",
              menuType: "module",
              moduleType: "custom",
              customConfig: {
                path: "/todo",
              },
            },
          ],
        },
      ],
    },
  ],
};
