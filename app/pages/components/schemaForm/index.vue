<template>
  <el-row class="schema-form">
    <template v-for="(itemSchema, key) in schema.properties">
      <component
        :is="FormItemConfig[itemSchema.option?.comType]?.component"
        v-show="itemSchema.option.visible !== false"
        ref="formComList"
        :schema="itemSchema"
        :schema-key="key"
        :initial-value="formData?.[key]"
      ></component>
    </template>
  </el-row>
</template>

<script setup>
import { ref, provide } from 'vue'
import FormItemConfig from './form-item-config'
import { validateWithZod } from '@elpis/common/zodSchemaBuilder'

provide('validateWithZod', validateWithZod)

const { schema, formData } = defineProps({
  /**
   * schema 配置，结构如下
     {
          type: 'object',
          properties: {
            key: {
              ...schema, // 标准 schema 配置
              type: '', // 字段类型
              label: '', // 字段中文名
              option: {
                ...elComponentConfig, // 标准 el-component-config 配置
                comType: '', // 配置组件类型  input/select/...
                visible: true, // 是否展示，默认为 true
                disabled: false, // 是否禁用，默认为 false
                default: '', // 默认值
                required: false // 是否必填，默认为 false

                // 当 comType === 'select' 时，可配置
                enumList: [
                  {
                    label: '',
                    value: ''
                  }
                ]
              }
            }
          },
        }
     */
  schema: {
    type: Object,
    default: () => ({})
  },
  /**
   * 表单数据
   */
  formData: {
    type: Object,
    default: () => ({})
  }
})

const formComList = ref([])

// 表单校验
const validate = () => {
  return formComList.value.every((component) => component.validate())
}

// 获取表单数据
const getValue = () => {
  return Object.assign({}, ...formComList.value.map((component) => component?.getValue()))
}

defineExpose({
  validate,
  getValue
})
</script>

<style lang="less">
.schema-form {
  .form-item {
    margin-bottom: 20px;
    min-width: 500px;
    position: relative;
    &__required {
      top: 4px;
      padding-left: 4px;
      color: #f56c6c;
      font-size: 20px;
    }
    &__label {
      line-height: 32px;
      margin-right: 15px;
      min-width: 70px;
      text-align: right;
      font-size: 14px;
      color: #ffffff;
      word-break: break-all;
    }
    &__component {
      width: 320px;
    }
    &__valid-border {
      .el-input__wrapper {
        border: 1px solid #f93f3f;
        box-shadow: 0 0 0 0;
      }
      .el-select__wrapper {
        border: 1px solid #f93f3f;
        box-shadow: 0 0 0 0;
      }
    }
    &__valid-tips {
      position: absolute;
      top: 100%;
      left: 86px;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      font-size: 12px;
      color: #f93f3f;
    }
  }
}
</style>
