import boot from '@elpis/pages/boot'
import dashboard from '.'
import bussinessDashboardRouterConfig from '@bussinessDashboardRouterConfig'

const routes = []

// 头部菜单路由
routes.push({
  path: '/iframe',
  component: () => import('./components/iframeView')
})
routes.push({
  path: '/schema',
  component: () => import('./components/schemaView')
})

const siderRoutes = [
  {
    path: 'iframe',
    component: () => import('./components/iframeView')
  },
  {
    path: 'schema',
    component: () => import('./components/schemaView')
  }
]

// 业务拓展路由
if (typeof bussinessDashboardRouterConfig === 'function') {
  bussinessDashboardRouterConfig({ routes, siderRoutes })
}

// 侧边栏菜单路由
routes.push({
  path: '/sider',
  component: () => import('./components/siderView'),
  children: siderRoutes
})

// 侧边栏兜底路由
routes.push({
  path: '/sider/:chapters+',
  component: () => import('./components/siderView')
})

boot(dashboard, { routes })
