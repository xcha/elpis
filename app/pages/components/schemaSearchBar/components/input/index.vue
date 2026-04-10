<template>
  <el-input v-model="dtoValue" v-bind="options" class="schema-search-bar__input"></el-input>
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

const emit = defineEmits(['loaded'])

const options = computed(() => {
  // 清除没必要的配置
  const opt = schema.option || {}
  return Object.fromEntries(
    Object.entries(opt).filter(([key]) => !['comType', 'default'].includes(key))
  )
})

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
