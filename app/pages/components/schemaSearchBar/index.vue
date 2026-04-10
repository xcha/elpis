<template>
  <el-form inline class="schema-search-bar">
    <!-- 动态组件 -->
    <el-form-item
      v-for="(schemaItem, key) in schema.properties"
      :key="key"
      :label="schemaItem.label"
    >
      <!-- 展示子组件 -->
      <component
        :is="SearchItemConfig[schemaItem?.option?.comType]?.component"
        ref="searchComList"
        :schema-key="key"
        :schema="schemaItem"
        @loaded="handleChildLoaded"
      />
    </el-form-item>
    <!-- 操作区域 -->
    <el-form-item>
      <el-button type="primary" plain class="schema-search-bar__search-btn" @click="search">
        搜索
      </el-button>
      <el-button plain class="schema-search-bar__reset-btn" @click="reset"> 重置 </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from 'vue'
import SearchItemConfig from './search-item-config'
const { schema } = defineProps({
  /**
   * schema 配置，结构如下
    {
        type: 'object',
        properties:  {
            key: {
                type: '', //字段类型
                label: '', //字段中文名
                // 字段在 search-bar 中的相关配置
                option: {
                    ...elComponentConfig, // 标准 el-component-config 配置
                    comType: '', // 配置组件类型  input/select/...
                    default: '' // 默认值
                }
            }
        }
    }
   */
  schema: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['load', 'search', 'reset'])

const searchComList = ref([])
const getValue = () =>
  Object.assign({}, ...searchComList.value.map((component) => component?.getValue()))

let childComLoadedCount = 0
const handleChildLoaded = () => {
  childComLoadedCount++
  if (childComLoadedCount === Object.keys(schema.properties).length) {
    emit('load', getValue())
  }
}
const search = () => emit('search', getValue())
const reset = () => {
  searchComList.value.forEach((component) => component?.reset())
  emit('reset', getValue())
}

defineExpose({
  getValue,
  reset
})
</script>
<style lang="less">
.schema-search-bar {
  min-width: 500px;
  &__search-btn,
  &__reset-btn {
    width: 80px;
  }
  &__select,
  &__dynamic-select {
    width: 180px;
  }
}
</style>
