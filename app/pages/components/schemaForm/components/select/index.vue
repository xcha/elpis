<template>
  <el-row type="flex" align="middle" class="form-item">
    <!-- label -->
    <el-row class="form-item__label" justify="end">
      <el-row v-if="schema.option?.required" type="flex" class="form-item__required">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="form-item__value">
      <el-select
        v-model="dtoValue"
        v-bind="options"
        class="form-item__component"
        :class="validTips ? 'form-item__valid-border' : ''"
        @change="onChange"
      >
        <el-option
          v-for="item in schema.option?.enumList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-row>
    <!-- 错误信息 -->
    <p v-if="validTips" class="form-item__valid-tips">
      {{ validTips }}
    </p>
  </el-row>
</template>
<script setup>
import { ref, watch, inject, onMounted, computed } from 'vue'
const validateWithZod = inject('validateWithZod')

const { schema, schemaKey, initialValue } = defineProps({
  schema: {
    type: Object,
    default: () => ({})
  },
  schemaKey: {
    type: String,
    default: ''
  },
  initialValue: {
    type: [Number, String],
    default: undefined
  }
})

const options = computed(() => {
  // 清除没必要的配置
  const opt = schema.option || {}
  return Object.fromEntries(
    Object.entries(opt).filter(([key]) => !['api', 'comType', 'default', 'visible'].includes(key))
  )
})

const name = ref('select')
const dtoValue = ref()
const validTips = ref(null)
const initData = () => {
  dtoValue.value = initialValue ?? schema.option?.default
  validTips.value = null
}

onMounted(() => {
  initData()
})

watch(
  [() => initialValue, () => schema],
  () => {
    initData()
  },
  { deep: true }
)

const validate = () => {
  validTips.value = null

  // 校验是否必填
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '不能为空'
    return false
  }

  // Zod 校验 schema
  if (dtoValue.value !== undefined && dtoValue.value !== null) {
    let dtoEnum = []
    if (schema.option?.enumList) {
      dtoEnum = schema.option.enumList.map((item) => item.value)
    }
    const { isValid, errorMessage } = validateWithZod({ ...schema, enum: dtoEnum }, dtoValue.value)
    if (!isValid) {
      validTips.value = errorMessage
      return false
    }
  }
  return true
}

const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {}
}

const onChange = () => {
  validate()
}

defineExpose({
  name,
  validate,
  getValue
})
</script>
<style lang="less" scoped></style>
