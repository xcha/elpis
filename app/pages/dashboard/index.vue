<template>
  <el-config-provider :locale="zhCn">
    <header-view :proj-name="projName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view></router-view>
      </template>
    </header-view>
  </el-config-provider>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import HeaderView from './components/headerView'
import $curl from '@elpis/common/curl'
import { useMenuStore } from '@elpis/store/menu'
import { useProjectStore } from '@elpis/store/project'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

onMounted(() => {
  getProjectList()
  getProjectConfig()
})

const projName = ref('')

// 请求 api/project/list 接口，并缓存到 project-store 中
const getProjectList = async () => {
  const res = await $curl({
    url: '/api/project/list',
    method: 'get',
    query: {
      proj_key: route.query.proj_key
    }
  })
  if (!res || !res.success || !res.data) return
  projectStore.setProjectList(res.data)
}

// 请求 api/project 接口，并缓存到 menu-store 中
const getProjectConfig = async () => {
  const res = await $curl({
    url: '/api/project',
    method: 'get',
    query: {
      proj_key: route.query.proj_key
    }
  })
  if (!res || !res.success || !res.data) return

  const { name, menu } = res.data
  projName.value = name
  menuStore.setMenuList(menu)
}

// 监听路由变化
watch(
  () => route.query.proj_key,
  (newProjKey) => {
    if (newProjKey) {
      getProjectConfig()
    }
  }
)

const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem
  if (key === route.query.key) return

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
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
:deep(.el-main) {
  padding: 0;
}
</style>
