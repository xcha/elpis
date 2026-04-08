<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu.js'

const route = useRoute()
const menuStore = useMenuStore()

const path = ref('')

const setPath = function () {
  const { key, sider_key: siderKey } = route.query
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: siderKey ?? key
  })

  // 添加更严格的检查
  const newPath = menuItem?.iframeConfig?.path
  if (newPath && typeof newPath === 'string' && newPath.startsWith('http')) {
    path.value = newPath
  } else {
    console.warn('Invalid iframe path:', newPath)
    path.value = ''  // 空字符串不会加载任何内容
  }
}

watch([
  () => route.query.key,
  () => route.query.sider_key,
  () => menuStore.menuList
], () => {
  setPath()
}, { deep: true })

onMounted(() => {
  setPath()
})
</script>

<template>
  <div style="height: 100%; width: 100%;">
    <!-- 只有当 path 有效时才显示 iframe -->
    <iframe v-if="path && path !== ''" :src="path" class="iframe"></iframe>
    <div v-else class="empty-state">暂无内容</div>
  </div>
</template>

<style lang="less" scoped>
.iframe {
  border: 0;
  width: 100%;
  height: 100%;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
</style>