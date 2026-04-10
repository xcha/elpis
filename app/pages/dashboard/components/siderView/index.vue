<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@elpis/store/menu'
import SiderContainer from '@elpis/components/siderContainer'
import SubMenu from './components/subMenu'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const menuList = ref([])
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key
  })
  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu
  }
}

const activeKey = ref('')
const setActiveKey = () => {
  let siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key
  })

  // 如果首次加载 siderView，用户未选中左侧菜单，需要默认选中第一个
  if (!siderMenuItem) {
    const hMenuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key
    })
    if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
      const siderMenuList = hMenuItem.siderConfig.menu
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList)
      if (siderMenuItem) {
        handleMenuSelect(siderMenuItem.key)
      }
    }
  }
  activeKey.value = siderMenuItem?.key
}

watch(
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setMenuList()
    setActiveKey()
  },
  { deep: true }
)

onMounted(() => {
  setMenuList()
  setActiveKey()
})

const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey
  })
  const { moduleType, key, customConfig } = menuItem

  // 如果是当前页面，不处理
  if (key === route.query.sider_key) return

  const pathMap = {
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
  }
  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: key,
      proj_key: route.query.proj_key
    }
  })
}

const handleMenuSelect = (menuKey) => {
  onMenuSelect(menuKey)
}
</script>
<style lang="less" scoped></style>
