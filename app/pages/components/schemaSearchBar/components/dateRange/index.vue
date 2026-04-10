<template>
  <el-date-picker
    v-model="dtoValue"
    v-bind="options"
    type="daterange"
    range-separator="~"
    :start-placeholder="`${schema.label}(开始)`"
    :end-placeholder="`${schema.label}(结束)`"
    value-format="YYYY-MM-DD"
    class="schema-search-bar__date-range"
  ></el-date-picker>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import moment from 'moment'

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
  return dtoValue.value?.length === 2
    ? {
        [`${schemaKey}_start`]: moment(dtoValue.value[0]).format('YYYY-MM-DD'),
        [`${schemaKey}_end`]: moment(dtoValue.value[1]).format('YYYY-MM-DD')
      }
    : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default ?? []
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
