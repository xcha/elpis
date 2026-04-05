{
  model: "dashboard"; // 模版类型，不同模版类型对应不一样的模版数据结构
  // 头部菜单
  menu: [
    {
      key: "", // 菜单唯一描述，
      name: "", // 菜单名称
      menuType: "", // 枚举值: group / module

      // 当 menuType == group 时，可填
      subMenu: [
        {
          // 可递归 menuItem
        },
      ],

      // 当 menuType == module 时，可填
      moduleType: "", // 枚举值: iframe/custom/schema

      siderConfig: {
        menu: [{}],
      },

      // 当 moduleType == iframe 时
      iframeConfig: {
        path: "", // iframe路径
      },

      // 当 moduleType == custom 时
      customConfig: {
        path: "", // 自定义组件路径
      },

      // 当 moduleType == schema 时
      schemaConfig: {
        api: "", // 数据源api
        schema: {
          // 板块数据结构
          type: "objecct",
          properties: {
            key: {
              ...schema, // 标准schema配置
              type: "",
              label: "",
              tableOption: {
                ...elTableColumnConfig,
                visiable: true,
              },
            },
          },
        },
        // table 相关配置
        tableConfig: {
          headerButtons: [
            {
              label: "", // 按钮中文名
              eventKey: "", // 按钮事件名
              eventOption: {}, // 按钮具体配置
              ...elButtonConfig, // 标准 el-button 配置
            },
          ],
          rowButtons: [
            {
              label: "", // 按钮中文名
              eventKey: "", // 按钮事件名
              eventOption: {
                //paramkey=参数的键值
                //rowvalueKey=参数值（当格式为schema:：tablekey的时候，到table中找响应的字段）
                paramKey: rowValueKey,
              }, // 按钮具体配置
              ...elButtonConfig, // 标准 el-button 配置
            },
          ],
        },

        searchConfig: {},
        components: {},
      },
    },
  ];
}
