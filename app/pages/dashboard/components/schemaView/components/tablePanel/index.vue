<template>
  <el-card class="table-panel">
    <!-- operation-panel -->
    <el-row
      v-if="tableConfig?.headerButtons?.length"
      justify="end"
      class="table-panel__operation-panel"
    >
      <el-button
        v-for="btn in tableConfig?.headerButtons"
        :key="btn.eventKey"
        v-bind="btn"
        @click="handleOperate({ btnConfig: btn })"
      >
        {{ btn.label }}
      </el-button>
    </el-row>
    <!-- schema-table (组件) -->
    <schema-table
      ref="schemaTableRef"
      :schema="tableSchema"
      :api="api"
      :api-params="apiParams"
      :buttons="tableConfig?.rowButtons ?? []"
      @operate="handleOperate"
    ></schema-table>
  </el-card>
</template>
<script setup>
import { ref, inject } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import $curl from '@elpis/common/curl'
import SchemaTable from '@elpis/components/schemaTable'

const emit = defineEmits(['operate'])

const { api, tableSchema, tableConfig, apiParams } = inject('schemaViewData')
const schemaTableRef = ref(null)

const removeData = async ({ btnConfig, rowData }) => {
  const { eventOption } = btnConfig
  if (!eventOption?.params) return

  const { params } = eventOption

  const removeKey = Object.keys(params)?.[0] ?? ''

  if (!removeKey) {
    ElNotification({
      title: '配置错误',
      message: '请配置删除参数:idKey',
      type: 'warning'
    })
    return
  }

  let removeValue
  const removeValueList = params[removeKey]?.split('::') ?? []
  if (removeValueList?.[0] === 'schema' && removeValueList?.[1]) {
    removeValue = rowData[removeValueList[1]]
  }

  ElMessageBox.confirm(`确定删除${removeKey}为${removeValue}的数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    schemaTableRef.value.showLoading()
    const res = await $curl({
      method: 'delete',
      url: api.value,
      data: {
        [removeKey]: removeValue
      },
      errorMessage: '删除失败'
    })
    schemaTableRef.value.hideLoading()

    if (!res || !res.success || !res.data) {
      ElNotification({
        title: '失败',
        message: res.message ?? '删除失败',
        type: 'error'
      })
      return
    }

    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success'
    })
    await initData()
  })
}

const EventHandlerMap = {
  remove: removeData
}
const handleOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  } else {
    emit('operate', { btnConfig, rowData })
  }
}

const initData = () => {
  schemaTableRef.value.initData()
}

const loadTableData = () => {
  schemaTableRef.value.loadTableData()
}

defineExpose({
  initData,
  loadTableData,
  schemaTableRef
})
</script>
<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;
  &__operation-panel {
    margin-bottom: 10px;
  }
}
:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>
