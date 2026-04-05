<template>
  <el-card class="table-panel" shadow="never">
    <!-- 操作按钮栏 -->
    <el-row v-if="hasHeaderButtons" justify="end" class="operation-panel">
      <el-button v-for="item in headerButtons" :key="item.label" v-bind="item"
        @click="operationHandler({ btnConfig: item })">
        {{ item.label }}
      </el-button>
    </el-row>

    <!-- 表格组件 -->
    <schema-table ref="schemaTableRef" :schema="tableSchema" :api="api" :buttons="rowButtons"
      @operate="operationHandler" />
  </el-card>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import $curl from '$common/curl.js'
import SchemaTable from '$widgets/schema-table/schema-table.vue'

// ==================== 常量定义 ====================
const SCHEMA_PREFIX = 'schema::'

// ==================== Emits ====================
const emit = defineEmits(['operate'])

// ==================== 依赖注入 ====================
const { api, tableSchema, tableConfig } = inject('schemaViewData', {
  api: '',
  tableSchema: {},
  tableConfig: {}
})

// ==================== Refs ====================
const schemaTableRef = ref(null)
// ==================== 计算属性 ====================
const headerButtons = computed(() => tableConfig.value?.headerButtons || [])
const rowButtons = computed(() => tableConfig.value?.rowButtons || [])
const hasHeaderButtons = computed(() => headerButtons.value.length > 0)

// ==================== 工具函数 ====================
/**
 * 解析参数值，支持 schema::fieldName 格式
 */
const parseParamsValue = (paramValue, rowData) => {
  if (typeof paramValue === 'string' && paramValue.startsWith(SCHEMA_PREFIX)) {
    const fieldName = paramValue.slice(SCHEMA_PREFIX.length)
    return rowData[fieldName]
  }
  return paramValue
}

/**
 * 解析按钮参数配置
 */
const resolveParams = (params, rowData) => {
  if (!params) return {}
  const resolved = {}
  for (const [key, value] of Object.entries(params)) {
    resolved[key] = parseParamsValue(value, rowData)
  }
  return resolved
}

/**
 * 显示通知
 */
const showNotification = (title, message, type = 'success') => {
  ElNotification({ title, message, type })
}

/**
 * 显示错误通知
 */
const showError = (message) => {
  showNotification('操作失败', message, 'error')
}

/**
 * 显示成功通知
 */
const showSuccess = (message) => {
  showNotification('操作成功', message, 'success')
}

// ==================== 删除业务 ====================
/**
 * 从按钮配置中提取删除参数
 */
const extractDeleteParams = (btnConfig, rowData) => {
  const { eventOption } = btnConfig

  if (!eventOption?.params) {
    console.warn('删除按钮缺少 eventOption.params 配置', btnConfig)
    return null
  }

  const params = resolveParams(eventOption.params, rowData)
  const deleteKey = Object.keys(params)[0]
  const deleteValue = params[deleteKey]

  if (!deleteKey || deleteValue === undefined) {
    console.error('删除参数解析失败:', { params, rowData })
    showError('无法解析删除参数，请检查配置')
    return null
  }

  return { deleteKey, deleteValue }
}

/**
 * 执行删除请求
 */
const executeDelete = async (deleteKey, deleteValue) => {
  schemaTableRef.value?.showLoading()

  try {
    const res = await $curl({
      method: 'delete',
      url: api.value,
      data: { [deleteKey]: deleteValue },
      errorMessage: '删除失败'
    })
    return res?.success === true
  } finally {
    schemaTableRef.value?.hideLoading()
  }
}

/**
 * 刷新表格数据
 */
const refreshTable = () => {
  schemaTableRef.value?.initData()
}

/**
 * 删除数据（主入口）
 */
const removeData = async ({ btnConfig, rowData }) => {
  // 1. 校验 API 地址
  if (!api.value) {
    console.error('API 地址未配置')
    showError('API 地址未配置')
    return
  }

  // 2. 提取删除参数
  const deleteParams = extractDeleteParams(btnConfig, rowData)
  if (!deleteParams) return

  const { deleteKey, deleteValue } = deleteParams

  // 3. 确认删除
  try {
    await ElMessageBox.confirm(
      `确认删除 ${deleteKey} 为「${deleteValue}」的数据？`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
    )
  } catch {
    // 用户取消删除
    console.log('用户取消删除')
    return
  }

  // 4. 执行删除
  const success = await executeDelete(deleteKey, deleteValue)

  // 5. 处理结果
  if (success) {
    showSuccess('数据已成功删除')
    refreshTable()
  } else {
    showError('删除失败，请稍后重试')
  }
}

// ==================== 事件处理器 ====================
const eventHandlerMap = {
  remove: removeData
}

const operationHandler = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  const handler = eventHandlerMap[eventKey]

  if (handler) {
    handler({ btnConfig, rowData })
  } else {
    emit('operate', { btnConfig, rowData })
  }
}

// ==================== 暴露方法 ====================
const initTableData = async () => {
  await schemaTableRef.value?.initData()
}

const loadTableData = async () => {
  await schemaTableRef.value?.loadTableData()
}

defineExpose({
  initTableData,
  loadTableData,
  refresh: initTableData
})

// 组件名称（便于调试）
defineOptions({ name: 'TablePanel' })
</script>

<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .operation-panel {
    margin-bottom: 16px;
    flex-shrink: 0;

    .el-button {
      margin-left: 12px;
    }
  }
}
</style>