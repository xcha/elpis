const glob = require('glob')
const path = require('path')
const fs = require('fs')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

// 动态构造 elpisPageEntrys  elpisHtmlWebpackPluginList
const elpisPageEntrys = {}
const elpisHtmlWebpackPluginList = []
// 获取 elpis/app/pages 目录下所有入口文件 （entry.xx.js）
const elpisEntryList = path.resolve(__dirname, '../../pages/**/entry.*.js')
glob
  .sync(elpisEntryList)
  .forEach((file) => handleFile(file, elpisPageEntrys, elpisHtmlWebpackPluginList))

// 动态构造 businessPageEntrys  businessHtmlWebpackPluginList
const businessPageEntrys = {}
const businessHtmlWebpackPluginList = []
// 获取 业务根目录/app/pages 目录下所有入口文件 （entry.xx.js）
const businessEntryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js')
glob
  .sync(businessEntryList)
  .forEach((file) => handleFile(file, businessPageEntrys, businessHtmlWebpackPluginList))

// 构造相关 webpack 处理的数据结构
function handleFile(file, entries = {}, htmlWebpackPluginList = []) {
  const entryName = path.basename(file, '.js')
  entries[entryName] = file
  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      // 指定要使用的模板文件
      template: path.resolve(__dirname, '../../view/entry.tpl'),
      // 要注入的代码块
      chunks: [entryName],
      // 产物（最终模板）输出路径
      filename: path.resolve(process.cwd(), 'app/public/dist/', `${entryName}.tpl`),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  )
}

// 加载 业务 webpack 配置
let businessWebpackConfig = {}
try {
  businessWebpackConfig = require(`${process.cwd()}/app/webpack/webpack.config.js`)
} catch (e) {
  console.log(e)
}

/**
 * webpack 基础配置
 */
module.exports = merge.smart(
  {
    // 入口文件
    entry: Object.assign({}, elpisPageEntrys, businessPageEntrys),
    // 出口文件
    output: {},
    // 模块加载器
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [require.resolve('vue-loader')]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 300 // 小于 300 字节转 base64
            }
          },
          generator: {
            filename: '[name].[hash:7][ext]'
          }
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name].[hash:7][ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.less', '.css', '.json'],
      modules: [
        'node_modules', // 优先查找当前项目的 node_modules
        path.resolve(__dirname, '../../../node_modules'), // 查找父级项目的 node_modules
        path.resolve(process.cwd(), 'node_modules') // 查找工作目录的 node_modules
      ],
      alias: (() => {
        const aliasMap = {}
        const blankModulePath = path.resolve(__dirname, '../libs/blank.js') // 空文件兜底

        // dashboard 路由拓展配置
        const bussinessDashboardRouterConfig = path.resolve(
          process.cwd(),
          './app/pages/dashboard/router.js'
        )
        aliasMap['@bussinessDashboardRouterConfig'] = fs.existsSync(bussinessDashboardRouterConfig)
          ? bussinessDashboardRouterConfig
          : blankModulePath

        // schemaView component 扩展配置
        const bussinessComponentConfig = path.resolve(
          process.cwd(),
          './app/pages/dashboard/components/schemaView/component-config.js'
        )
        aliasMap['@bussinessComponentConfig'] = fs.existsSync(bussinessComponentConfig)
          ? bussinessComponentConfig
          : blankModulePath

        // schemaForm form-item 扩展配置
        const bussinessFormItemConfig = path.resolve(
          process.cwd(),
          './app/pages/components/schemaForm/form-item-config.js'
        )
        aliasMap['@bussinessFormItemConfig'] = fs.existsSync(bussinessFormItemConfig)
          ? bussinessFormItemConfig
          : blankModulePath

        // schemaSearchBar search-item 扩展配置
        const bussinessSearchItemConfig = path.resolve(
          process.cwd(),
          './app/pages/components/schemaSearchBar/search-item-config.js'
        )
        aliasMap['@bussinessSearchItemConfig'] = fs.existsSync(bussinessSearchItemConfig)
          ? bussinessSearchItemConfig
          : blankModulePath

        // headerContainer 扩展配置
        const bussinessHeaderConfig = path.resolve(
          process.cwd(),
          './app/pages/components/headerContainer/header-config.js'
        )
        aliasMap['@bussinessHeaderConfig'] = fs.existsSync(bussinessHeaderConfig)
          ? bussinessHeaderConfig
          : blankModulePath

        return {
          '@elpis/pages': path.resolve(__dirname, '../../pages'),
          '@elpis/assets': path.resolve(__dirname, '../../pages/assets'),
          '@elpis/common': path.resolve(__dirname, '../../pages/common'),
          '@elpis/curl': path.resolve(__dirname, '../../pages/common/curl.js'),
          '@elpis/utils': path.resolve(__dirname, '../../pages/common/utils.js'),

          '@elpis/components': path.resolve(__dirname, '../../pages/components'),
          '@elpis/headerContainer': path.resolve(
            __dirname,
            '../../pages/components/headerContainer/index.vue'
          ),
          '@elpis/siderContainer': path.resolve(
            __dirname,
            '../../pages/components/siderContainer/index.vue'
          ),
          '@elpis/schemaSearchBar': path.resolve(
            __dirname,
            '../../pages/components/schemaSearchBar/index.vue'
          ),
          '@elpis/schemaForm': path.resolve(
            __dirname,
            '../../pages/components/schemaForm/index.vue'
          ),
          '@elpis/schemaTable': path.resolve(
            __dirname,
            '../../pages/components/schemaTable/index.vue'
          ),

          '@elpis/store': path.resolve(__dirname, '../../pages/store'),
          '@elpis/boot': path.resolve(__dirname, '../../pages/boot.js'),
          ...aliasMap
        }
      })()
    },
    plugins: [
      // 显示打包进度
      new webpack.ProgressPlugin(),
      new VueLoaderPlugin(),
      new webpack.ProvidePlugin({ Vue: 'vue', axios: 'axios', _: 'lodash' }), // 把第三方库暴露到 window context 下，方便在浏览器中调试
      // 定义全局常量
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true), // 开启 vue3 的 options api
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // 关闭生产环境 vue3 的 devtools
        __VUE_PROD_HYDRATION_MISSMATCH__: JSON.stringify(false), // 关闭生产环境 vue3 的 hydration 警告
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      }),
      // 构造最终渲染的页面模板
      ...elpisHtmlWebpackPluginList,
      ...businessHtmlWebpackPluginList
    ],
    // 配置打包输出优化（配置代码分割、模块合并、缓存、treeshaking、压缩等优化策略）
    optimization: {
      /**
       * 把 js 文件打包成3种类型
       * 1. vendor 第三方lib库，基本不会改动，除非依赖版本升级
       * 2. common 业务组件代码的公共部分收取出来，改动较少
       * 3. entry.{page}: 不同页面 entry 里的业务组件代码的差异部分，会经常改动
       * 目的：把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存效果
       */
      splitChunks: {
        chunks: 'all', //对同步和异步模块都进行分割
        // maxSize: 500000, // 500KB
        // minSize: 30000, // 30KB
        maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
        maxInitialRequests: 10, // 入口点的最大并行请求数
        cacheGroups: {
          vendor: {
            // 第三方库
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 20, // 优先级，数字越大，优先级越高
            enforce: true, // 强制执行
            reuseExistingChunk: true // 复用已有的公共 chunk
          },
          common: {
            // 公共模块
            name: 'common',
            test: /[\\/]common|components[\\/]/,
            minChunks: 2, // 被两处引用的即被归为公共模块
            priority: 10,
            reuseExistingChunk: true
          }
        }
      },
      minimize: true,
      // 将 webpack 运行时代码抽离成单独文件
      runtimeChunk: true
    }
  },
  businessWebpackConfig
)
