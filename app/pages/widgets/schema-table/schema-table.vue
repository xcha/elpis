<template>
  <div class="schema-table">
    <!-- 骨架屏：schema 未加载时显示 -->
    <div v-if="!isSchemaReady" class="schema-skeleton">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 表格：schema 加载完成后显示 -->
    <template v-else>
      <el-table v-loading="loading" :data="tableData" class="table" border stripe>
        <!-- 动态列 -->
        <el-table-column v-for="(schemaItem, key) in visibleColumns" :key="key" :prop="key" :label="schemaItem.label"
          v-bind="schemaItem.option || {}" />

        <!-- 操作列 -->
        <el-table-column v-if="hasButtons" label="操作" fixed="right" :width="operationWidth">
          <template #default="scope">
            <el-button v-for="item in buttons" :key="item.label" link v-bind="item"
              @click="operationHandler({ btnConfig: item, rowData: scope.row })">
              {{ item.label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row class="pagination" justify="end">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="PAGE_SIZES"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="onPageSizeChange"
          @current-change="onCurrentPageChange" />
      </el-row>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import $curl from '$common/curl.js'

// ==================== 常量定义 ====================
const PAGE_SIZES = [10, 20, 50, 100, 200]
const DEFAULT_PAGE_SIZE = 50
const DEBOUNCE_DELAY = 100

// ==================== Props ====================
const props = defineProps({
  schema: {
    type: Object,
    default: () => ({ type: 'object', properties: {} })
  },
  api: {
    type: String,
    default: ''
  },
  buttons: {
    type: Array,
    default: () => []
  }
})

// ==================== Emits ====================
const emit = defineEmits(['operate'])

// ==================== 计算属性 ====================
// 是否就绪：schema 有数据
const isSchemaReady = computed(() => {
  return props.schema?.properties && Object.keys(props.schema.properties).length > 0
})

// 可见的列（过滤掉隐藏的）
const visibleColumns = computed(() => {
  if (!props.schema?.properties) return {}

  const columns = {}
  for (const [key, value] of Object.entries(props.schema.properties)) {
    if (value.option?.visible !== false) {
      columns[key] = value
    }
  }
  return columns
})

// 是否有操作按钮
const hasButtons = computed(() => props.buttons?.length > 0)
// 操作列宽度
const operationWidth = computed(() => {
  if (!hasButtons.value) return 0

  const baseWidth = 50
  const charWidth = 18
  const totalLabelLength = props.buttons.reduce((sum, btn) => {
    return sum + (btn.label?.length || 0)
  }, 0)

  return baseWidth + totalLabelLength * charWidth
})

// ==================== 响应式状态 ====================
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const total = ref(0)

// ==================== 数据获取 ====================
const showLoading = () => { loading.value = true }
const hideLoading = () => { loading.value = false }


let debounceTimer = null

const fetchTableData = async () => {
  // 前置检查
  if (!props.api || loading.value) return

  loading.value = true

  try {
    const res = await $curl({
      url: `${props.api}/list`,
      method: 'get',
      query: {
        page: currentPage.value,
        size: pageSize.value
      }
    })

    if (!res?.success) {
      console.warn('API 请求失败:', res)
      tableData.value = []
      total.value = 0
      return
    }

    tableData.value = buildTableData(res.data || [])
    total.value = res.metadata?.total || 0
  } catch (error) {
    console.error('获取表格数据失败:', error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 带防抖的加载
const loadTableData = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchTableData, DEBOUNCE_DELAY)
}

// ==================== 数据处理 ====================
const buildTableData = (listData) => {
  if (!props.schema?.properties || !Array.isArray(listData)) {
    return listData
  }

  return listData.map(rowData => {
    const newRow = { ...rowData }

    for (const [key, value] of Object.entries(newRow)) {
      const schemaItem = props.schema.properties[key]
      const toFixed = schemaItem?.option?.toFixed

      if (toFixed && typeof value === 'number' && !isNaN(value)) {
        newRow[key] = value.toFixed(toFixed)
      }
    }

    return newRow
  })
}

// ==================== 初始化 ====================
const initData = () => {
  currentPage.value = 1
  pageSize.value = DEFAULT_PAGE_SIZE
  nextTick(loadTableData)
}

// ==================== 事件处理 ====================
const onPageSizeChange = () => {
  loadTableData()
}

const onCurrentPageChange = () => {
  loadTableData()
}

const operationHandler = ({ btnConfig, rowData }) => {
  emit('operate', { btnConfig, rowData })
}

// ==================== 暴露方法 ====================
defineExpose({
  initData,
  loadTableData,
  refresh: fetchTableData,
  getLoading: () => loading.value,
  showLoading,
  hideLoading
})

// ==================== 生命周期 ====================
// 监听 schema 或 api 变化
watch(
  [() => props.schema, () => props.api],
  () => {
    if (isSchemaReady.value && props.api) {
      initData()
    }
  },
  { deep: true }
)

// 组件挂载时初始化
onMounted(() => {
  if (isSchemaReady.value && props.api) {
    initData()
  }
})
</script>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 300px;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 16px 0;
    padding: 0 16px;
    text-align: right;
  }

  .schema-skeleton {
    flex: 1;
    padding: 20px;
  }
}
</style>