<template>
  <el-select v-model="dtoValue" v-bind="options" class="schema-search-bar__select">
    <el-option
      v-for="item in enumList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'

const { schemaKey, schema } = defineProps({
  schemaKey: {
    type: String,
    default: ''
  },
  schema: {
    type: Object,
    default: () => ({})
  }
})

const enumList = computed(() => {
  return schema.option?.enumList ?? []
})

const options = computed(() => {
  // 清除没必要的配置
  const opt = schema.option || {}
  return Object.fromEntries(
    Object.entries(opt).filter(([key]) => !['enumList', 'comType', 'default'].includes(key))
  )
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()

const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default
}

onMounted(() => {
  reset()
  emit('loaded')
})

defineExpose({
  getValue,
  reset
})
</script>
<style lang="less" scoped></style>
