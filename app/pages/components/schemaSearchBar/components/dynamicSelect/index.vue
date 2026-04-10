<template>
  <el-select v-model="dtoValue" v-bind="options" class="schema-search-bar__dynamic-select">
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
import $curl from '@elpis/common/curl'

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

const dtoValue = ref()
const enumList = ref([])

const options = computed(() => {
  // 清除没必要的配置
  const opt = schema.option || {}
  return Object.fromEntries(
    Object.entries(opt).filter(([key]) => !['api', 'comType', 'default'].includes(key))
  )
})

const fetchEnumList = async () => {
  const res = await $curl({
    url: schema.option?.api,
    method: 'get',
    data: {}
  })
  if (res?.data?.length > 0) enumList.value = res.data
}

const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default
}

onMounted(async () => {
  await fetchEnumList()
  reset()
  emit('loaded')
})

defineExpose({
  getValue,
  reset
})
</script>
<style lang="less" scoped></style>
