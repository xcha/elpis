import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import pinia from "$store";
import { createWebHashHistory, createRouter } from "vue-router";

/**
 *vue页面主入口，用于启动vue
 * @params pageComponent vue 入口组件
 * @params {*} options 启动选项
 * @params {*} options.routes 路由配置
 * @params {*} options.libs 要加载的库
 */

export default (pageComponent, { routes, libs } = {}) => {
  const app = createApp(pageComponent);
  app.use(ElementPlus);
  app.use(pinia);

  // 加载指定的库
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; i++) {
      app.use(libs[i]);
    }
  }

  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
};
