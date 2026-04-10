<template>
  <div class="schema-table">
    <el-table v-loading="loading" :data="tableData" class="schema-table__table">
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column
          v-if="schemaItem.option?.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>
      <el-table-column
        v-if="buttons?.length > 0"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <template #default="{ row }">
          <el-button
            v-for="btn in buttons"
            :key="btn.eventKey"
            link
            v-bind="btn"
            @click="handleOperate({ btnConfig: btn, rowData: row })"
          >
            {{ btn.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="schema-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-row>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import $curl from '@elpis/common/curl'
import { debounce, buildTableData } from '@elpis/common/utils'

const { schema, api, buttons, apiParams } = defineProps({
  /**
   * schema配置，结构如下：
    {
      type: 'object',
      properties: {
        key: {
          type: '', //字段类型
          label: '', //字段中文名
          // 字段在 table 中的相关配置
          option: {
            ...elTableColumnConfig, // 标准 el-table-column 配置
            visible: true // 默认为 true （false 或 不配置，表示不再表单中显示）
          }
        }
      }
    }
   */
  schema: { type: Object, default: () => ({}) },
  /**
   * 表格数据 api
   */
  api: { type: String, default: '' },
  /**
   * buttons 操作按钮相关配置，结构如下：
    [{
      label: '', // 按钮中文名
      eventKey: '', // 按钮事件名
      eventOption: {}, // 按钮具体配置
      ...elButtonConfig // 标准 el-button 配置
    }]
   */
  buttons: { type: Array, default: () => [] },
  /**
   * api 请求参数，请求 API 时携带
   */
  apiParams: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['operate'])

const operationWidth = computed(() => {
  return buttons?.length ? buttons.reduce((pre, cur) => pre + cur.label.length * 18, 50) : 50
})

const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadTableData()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadTableData()
}

const loadTableData = debounce(async () => {
  if (!api || loading.value) return
  showLoading()
  // 处理 当处于最后一页，且场景为：删除最后一条数据时，调整 currentPage
  if (
    total.value !== 0 &&
    total.value - 1 <= currentPage.value * pageSize.value &&
    currentPage.value > 1
  ) {
    currentPage.value -= 1
  }
  try {
    const res = await $curl({
      method: 'get',
      url: `${api}/list`,
      query: {
        ...apiParams,
        pageIndex: currentPage.value,
        pageSize: pageSize.value
      }
    })
    if (!res || !res.success || !Array.isArray(res.data)) {
      tableData.value = []
      total.value = 0
      return
    }
    tableData.value = buildTableData(res.data, schema)
    total.value = res.metadata?.total ?? 0
  } catch (error) {
    console.error('加载表格数据失败:', error)
    tableData.value = []
    total.value = 0
  } finally {
    hideLoading()
  }
})

const initData = () => {
  currentPage.value = 1
  pageSize.value = 50
  nextTick(() => {
    loadTableData()
  })
}

watch(
  [() => schema, () => api, () => apiParams],
  () => {
    initData()
  },
  { deep: true }
)

const showLoading = () => {
  loading.value = true
}

const hideLoading = () => {
  loading.value = false
}

const handleOperate = ({ btnConfig, rowData }) => {
  emit('operate', { btnConfig, rowData })
}

defineExpose({
  initData,
  loadTableData,
  showLoading,
  hideLoading
})
</script>
<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  &__table {
    flex: 1;
  }
  &__pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
