<template>
  <header-container :title="projName">
    <template #menu-content>
      <!-- 根据 menuStore.menuList 渲染 -->
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        mode="horizontal"
        @select="onMenuSelect"
      >
        <template v-for="item in menuStore.menuList">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template v-if="projectStore.projectList.length > 1" #setting-content>
      <!-- 根据 projectStore.projectList 渲染 -->
      <el-dropdown :disabled="loading" @command="handleProjectCommand">
        <span class="project-list">
          {{ projName }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projName || loading"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <slot name="main-content"></slot>
    </template>
  </header-container>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import HeaderContainer from '@elpis/components/headerContainer'
import SubMenu from './components/subMenu'
import { useProjectStore } from '@elpis/store/project'
import { useMenuStore } from '@elpis/store/menu'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const menuStore = useMenuStore()
defineProps({
  projName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['menu-select'])

const activeKey = ref('')
const setActiveKey = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key
  })
  activeKey.value = menuItem?.key || ''
}

watch([() => route.query.key, () => menuStore.menuList], () => setActiveKey(), { deep: true })

onMounted(() => {
  setActiveKey()
})
const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey
  })
  emit('menu-select', menuItem)
}
const loading = ref(false)
const handleProjectCommand = async (command) => {
  const projItem = projectStore.projectList.find((item) => item.key === command)
  if (!projItem || !projItem.homePage) return

  // 会短暂白屏
  // const { origin } = window.location
  // window.location.replace(`${origin}/view/dashboard${projItem.homePage}`)

  loading.value = true
  try {
    // 解析 homePage 中的路径和查询参数
    const [path, search] = projItem.homePage.split('?')
    const searchParams = new URLSearchParams(search)
    const query = Object.fromEntries(searchParams)

    // 重置所有状态
    menuStore.setMenuList([])
    window.__ELPIS_PROJ_KEY__ = query.proj_key

    // 使用 router.replace 进行路由切换
    await router.replace({
      path,
      query
    })
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped>
.project-list {
  margin-right: 20px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  outline: none;
}
:deep(.el-menu--horizontal.el-menu) {
  border-bottom: none;
}
</style>
