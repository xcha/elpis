<template>
  <sider-container class="sider-view-root">
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList" :key="item.key">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>

    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>

import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '$store/menu.js';

// 正确：只在这里导入一次，放顶部
import SiderContainer from '$widgets/sider-container/sider-container.vue';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const menuList = ref([]);
const activeKey = ref('');

// 加载菜单
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({ key: 'key', value: route.query.key });
  if (menuItem?.siderConfig?.menu) {
    menuList.value = menuItem.siderConfig.menu;
  }
};

// 激活菜单
const setActiveKey = () => {
  let siderMenuItem = menuStore.findMenuItem({ key: 'key', value: route.query.sider_key });
  if (!siderMenuItem) {
    const hMenuItem = menuStore.findMenuItem({ key: 'key', value: route.query.key });
    if (hMenuItem?.siderConfig?.menu) {
      siderMenuItem = menuStore.findFirstMenuItem(hMenuItem.siderConfig.menu);
    }
  }
  activeKey.value = siderMenuItem?.key || '';
};

watch(() => route.query.key, () => {
  setMenuList();
  setActiveKey();
});

watch(() => menuStore.menuList, () => {
  setMenuList();
  setActiveKey();
}, { deep: true });

onMounted(() => {
  setMenuList();
  setActiveKey();
});

// 点击跳转
const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({ key: 'key', value: menuKey });
  if (!menuItem || menuItem.key === route.query.sider_key) return;

  const { moduleType, key, customConfig } = menuItem;
  const pathMap = { iframe: '/iframe', schema: '/schema', custom: customConfig?.path };

  router.push({
    path: `/view/dashboard/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: key,
      proj_key: route.query.proj_key
    }
  });
};
</script>

<style lang="less" scoped>
.sider-view-root {
  flex: 1;
  min-height: 0;
}
</style>