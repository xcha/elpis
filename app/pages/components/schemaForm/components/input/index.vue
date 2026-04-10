<template>
  <el-row type="flex" align="middle" class="form-item">
    <!-- label -->
    <el-row class="form-item__label" justify="end">
      <el-row v-if="schema.option?.required" type="flex" class="form-item__required">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="form-item__value">
      <el-input
        v-model="dtoValue"
        v-bind="options"
        class="form-item__component"
        :class="validTips ? 'form-item__valid-border' : ''"
        :placeholder="placeholder"
        @focus="onFocus"
        @blur="onBlur"
      ></el-input>
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
    type: String,
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

const name = ref('input')
const dtoValue = ref()
const placeholder = ref('')
const validTips = ref(null)
const initData = () => {
  dtoValue.value = initialValue ?? schema.option?.default
  validTips.value = null
  const { maxLength, minLength, pattern } = schema
  const ruleList = []

  if (schema.option?.placeholder) {
    ruleList.push(schema.option.placeholder)
  }
  if (minLength) {
    ruleList.push(`最小长度：${minLength}`)
  }
  if (maxLength) {
    ruleList.push(`最大长度：${maxLength}`)
  }
  if (pattern) {
    ruleList.push(`格式：${pattern}`)
  }

  placeholder.value = ruleList.join('|')
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

const onFocus = () => {
  validTips.value = null
}

const onBlur = () => {
  validate()
}

const validate = () => {
  validTips.value = null

  // 校验是否必填
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '不能为空'
    return false
  }

  // Zod 校验 schema
  if (dtoValue.value !== undefined && dtoValue.value !== null) {
    const { isValid, errorMessage } = validateWithZod(schema, dtoValue.value)
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

defineExpose({
  name,
  validate,
  getValue
})
</script>
<style lang="less" scoped></style>
