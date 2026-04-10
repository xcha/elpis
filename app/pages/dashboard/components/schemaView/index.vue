<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema?.properties).length > 0"
      @search="onSearch"
    ></search-panel>
    <table-panel ref="tablePanelRef" @operate="onTableOperate"></table-panel>
    <component
      :is="ComponentConfig[key]?.component"
      v-for="(_, key) in components"
      :key="key"
      ref="comListRef"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>
<script setup>
import { provide, ref, watch } from 'vue'
import SearchPanel from './components/searchPanel'
import TablePanel from './components/tablePanel'
import ComponentConfig from './component-config'
import { useSchema } from './hooks/schema'

const { api, tableSchema, tableConfig, searchSchema, searchConfig, components } = useSchema()
const apiParams = ref({})

provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components
})

const comListRef = ref([])
const tablePanelRef = ref(null)

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

watch(tableSchema, () => {
  apiParams.value = {}
})

// showComponent 展示动态组件
const showComponent = ({ btnConfig, rowData }) => {
  const { comName } = btnConfig.eventOption
  if (!comName) return
  const comRef = comListRef.value.find((item) => item.name === comName)
  if (!comRef || typeof comRef.show !== 'function') return
  comRef.show(rowData)
}

// table 事件映射
const EventHandlerMap = {
  showComponent
}

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  }
}

// 响应组件事件
const onComponentCommand = (data) => {
  const { event } = data
  if (event === 'loadTableData') {
    tablePanelRef.value.loadTableData()
  }
}
</script>
<style lang="less" scoped>
.schema-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
