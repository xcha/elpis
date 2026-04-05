<template>
  <el-config-provider :locale="zhCn">
    <div class="dashboard-wrapper">
      <header-view :proj-name="projName" @menu-select="onMenuSelect">
        <template #main-content>
          <router-view></router-view>
        </template>
      </header-view>
    </div>
  </el-config-provider>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-view/header-view.vue';
import $curl from '$common/curl.js';
import { useMenuStore } from '$store/menu.js';
import { useProjectStore } from '$store/project.js';

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore();
const projectStore = useProjectStore();

onMounted(() => {
  getProjectList();
  getProjectConfig();
});
const projName = ref('');
// 请求/api/project/list接口，并缓存到project-store中
async function getProjectList() {
  const res = await $curl({
    method: 'get',
    url: '/api/project/list',
    query: {
      //TODO：动态获取当前项目key，暂时先写死pdd
      proj_key: route.query.proj_key,
    },
  });
  if (!res || !res.success || !res.data) {
    return;
  }
  projectStore.setProjectList(res.data);
}

// 请求/api/project接口，并g缓存到menu-store中
async function getProjectConfig() {
  const res = await $curl({
    method: 'get',
    url: '/api/project',
    query: {
      //TOD0：动态获取当前项目key，暂时先写死pdd
      proj_key: route.query.proj_key,
    },
  });
  if (!res || !res.success || !res.data) {
    return;
  }
  const { name, menu } = res.data;
  projName.value = name;
  menuStore.setMenuList(menu);
}

//点击菜单回调方法
const onMenuSelect = function (menuItem) {
  const { moduleType, key, customConfig } = menuItem;
  //如果是当前页面，不处理
  if (key === route.query.key) {
    return;
  }
  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,

  }
  router.push({
    path: pathMap[moduleType],
    query: {
      key,
      proj_key: route.query.proj_key
    }
  })
}
</script>

<style lang="less" scoped>
.dashboard-wrapper {
  height: 100%;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  border-bottom: 0;
}
</style>