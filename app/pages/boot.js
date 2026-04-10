import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@elpis/assets/custom.css'
import pinia from '@elpis/store'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * vue 页面主入口，用于启动 vue
 * @param pageComponent vue 入口文件
 * @param routes 路由列表
 * @param libs 页面依赖的第三方包
 * @param basePath 路由基础路径
 */
export default (pageComponent, { routes, libs } = {}) => {
  // 动态获取路由基础路径
  const entryName =
    typeof window !== 'undefined' && window.__ELPIS_ENTRY_NAME__ ? window.__ELPIS_ENTRY_NAME__ : ''
  const basePath = entryName ? `/view/${entryName}` : '/view'

  const app = createApp(pageComponent)
  app.use(ElementPlus)
  app.use(pinia)

  //引入第三方包
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; i++) {
      app.use(libs[i])
    }
  }

  //页面路由
  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHistory(basePath),
      routes
    })
    app.use(router)
    router.isReady().then(() => app.mount('#app'))
  } else {
    app.mount('#app')
  }
}
