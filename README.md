# Elpis - 基于 Koa + Vue3 的企业级全栈应用框架

## elpis框架的核心设计哲学

originate from @allen-z-x

### 🤔 一、根本性问题洞察

传统企业级应用中，开发者80%的时间消耗在重复性业务逻辑实现上：

1. 基础CRUD接口的重复开发
2. 相似业务组件的重复编写
3. 大同小异的表单验证逻辑
4. 高度雷同的表格展示需求

### 📖 二、革命性解决方案

Elpis 通过 DSL 领域模型的开发范式重构开发流程：

1. 统一建模层

- 模型使用继承的理念，一个领域模型可以衍生出若干个项目

2. 智能解析引擎

- 模型 → 页面：自动生成 CRUD 标准页面
- 模型 → 组件：动态渲染表单/表格/搜索框/详情面板/...
- 模型 → 菜单：自动化配置前端路由

### 🚩 三、工程价值量化

| 指标             | 传统开发 | elpis方案 | 提升幅度 |
| ---------------- | -------- | --------- | -------- |
| CRUD实现耗时     | 8h       | 0.5h      | 16x      |
| 代码重复率       | 80%      | <5%       | 16x      |
| 需求变更响应速度 | 2天      | 2小时     | 24x      |

Elpis 为解决大量重复性 CRUD 业务场景而生。如果你想进一步了解 Elpis[本文章有详细介绍](https://juejin.cn/post/7523038523676196910)

### model配置

```javascript
{
  mode: 'dashboard', // 模板类型，不同模板类型对应不一样的模板数据结构
  name: '', //名称
  desc: '', //描述
  icon: '', //图标
  homePage: '', //首页（项目配置）
  menu: [
    {
      key: '', //菜单唯一描述
      name: '', //菜单名称
      menuType: '', //枚举值  group/module

      // 当menuType == group 时，可填
      subMenu: [{}],

      moduleType: '', // 枚举值  sider/iframe/custom/schema

      //当 moduleType == sider 时
      siderConfig: {
        menu: [{}]
      },

      //当 moduleType == iframe 时
      iframeConfig: {
        path: '' // iframe 路径
      },

      //当 moduleType == custom 时
      customConfig: {
        path: '' // 自定义路由路径
      },

      //当 moduleType == schema 时
      schemaConfig: {
        api: '', // 数据源API (遵循 restfull 规范)
        schema: {
          type: 'object',
          properties: {
            key: {
              type: '', //字段类型
              label: '', //字段中文名
              // 字段在 table 中的相关配置
              tableOption: {
                ...elTableColumnConfig, // 标准 el-table-column 配置
                toFixed: 0,
                visible: true // 默认为 true （false表示不在表单中显示）
              },
              // 字段在 search-bar 中的相关配置
              searchOption: {
                ...elComponentConfig, // 标准 el-component-config 配置
                comType: '', // 配置组件类型  input/select/...
                default: '', // 默认值

                // 当 comType === 'select' 时，可配置
                enumList: [
                  {
                    label: '',
                    value: ''
                  }
                ],

                // 当 comType === 'dynamicSelect' 时，可配置
                api: '' // 数据源API (遵循 restfull 规范)
              },
              // 字段在不同动态 component 中的相关配置，前缀对应 componentConfig 中的键值
              // 如：componentConfig.createForm  这里对应 createFormOption
              // 字段在 createForm 中相关配置
              createFormOption: {
                ...elComponentConfig, // 标准 el-component-config 配置
                comType: '', // 配置组件类型  input/select/...
                visible: true, // 是否展示，默认为 true
                disabled: false, // 是否禁用，默认为 false
                default: '', // 默认值

                // 当 comType === 'select' 时，可配置
                enumList: [
                  {
                    label: '',
                    value: ''
                  }
                ]
              },
              // 字段在 editForm 中相关配置
              editFormOption: {
                ...elComponentConfig, // 标准 el-component-config 配置
                comType: '', // 配置组件类型  input/select/...
                visible: true, // 是否展示，默认为 true
                disabled: false, // 是否禁用，默认为 false
                default: '', // 默认值

                // 当 comType === 'select' 时，可配置
                enumList: [
                  {
                    label: '',
                    value: ''
                  }
                ]
              },
              detailPanelOption: {
                ...elComponentConfig // 标准 el-component-config 配置
              },
              apiOption: {}, // 数据源配置
              dbOption: {} // 数据库配置
            }
          },
          required: [] // 标记哪些字段为必填项
        },
        tableConfig: {
          headerButtons: [
            {
              label: '', // 按钮中文名
              eventKey: '', // 按钮事件名
              // 按钮具体配置
              eventOption: {
                // 当 eventKey === 'showComponent'
                comName: '' // 组件名
              },
              ...elButtonConfig // 标准 el-button 配置
            }
          ], // 表头按钮
          rowButtons: [
            {
              label: '', // 按钮中文名
              eventKey: '', // 按钮事件名
              eventOption: {
                // 当 eventKey === 'showComponent'
                comName: '', // 组件名

                // 当 eventKey === 'remove'
                params: {
                  idKey: 'schema::idKey' // 当格式为 schema::tableKey 的时候，到 table 中找相应的字段
                }
              }, // 按钮具体配置
              ...elButtonConfig // 标准 el-button 配置
            }
          ] // 行按钮
        }, // table 相关配置
        searchConfig: {}, //search-bar 相关配置
        // 动态组件 相关配置
        componentConfig: {
          // createForm 表单相关配置
          createForm: {
            title: '', // 表单标题
            saveBtnText: '' // 保存按钮文案
          },
          // editForm 表单相关配置
          editForm: {
            mainKey: '', // 表单主键，用于唯一标识要修改的数据对象
            title: '', // 表单标题
            saveBtnText: '' // 保存按钮文案
          },
          detailPanel: {
            mainKey: '', // 表单主键，用于唯一标识要修改的数据对象
            title: '' // 表单标题
          }
        }
      }
    }
  ]
}
```

### 服务端启动

```javascript
const { serverStart } = require('@lian_ci/elpis')

// 启动 Elpis 服务
const app = serverStart({})
```

### 自定义服务端

- router-schema
- router
- controller
- service
- extend
- config

### 前端构建

```javascript
const { frontendBuild } = require('@lian_ci/elpis')

frontendBuild(process.env.NODE_ENV)
```

### 自定义页面扩展

- 在 `app/pages/` 目录下写入口 entry.xxx.js

### dashboard / customView 自定义页面扩展

- 在 `app/pages/dashboard/xxx/` 目录下写页面 (xxx自定义)

### dashboard / components / schemaView / components 动态组件扩展

1. 在 `app/pages/dashboard/components/schemaView/components/` 目录下写组件
2. 配置到 `app/pages/dashboard/components/schemaView/component-config.js` 文件中

### schemaForm 控件扩展

1. 在 `app/pages/components/schemaForm/components/` 目录下写组件
2. 配置到 `app/pages/components/schemaForm/form-item-config.js` 文件中

### schemaSearchBar 控件扩展

1. 在 `app/pages/components/schemaSearchBar/components/` 目录下写组件
2. 配置到 `app/pages/components/schemaSearchBar/search-item-config.js` 文件中
