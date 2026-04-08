<template>
  <el-row class="schema-view">
    <search-panel v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"></search-panel>
    <table-panel @operate="onTableOperate"></table-panel></el-row>
</template>

<script setup>
import { ref, provide } from 'vue';
import SearchPanel from './complex-veiw/search-panel/search-panel.vue';
import TablePanel from './complex-veiw/table-panel/table-panel.vue';
import { useSchema } from './hook/schema.js'

const { api, tableConfig, tableSchema, searchConfig, searchSchema } = useSchema()

const apiParams = ref({})
provide('schemaViewData', {
  api,
  apiParams,
  tableConfig,
  tableSchema,
  searchConfig,
  searchSchema
})

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

const onTableOperate = () => {

}

</script>

<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
