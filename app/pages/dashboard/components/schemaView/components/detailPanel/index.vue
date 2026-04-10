<template>
  <el-drawer v-model="isShow" direction="rtl" :destroy-on-close="true" :size="550">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <el-card v-loading="loading" shadow="always" class="detail-panel">
        <el-row
          v-for="(item, key, index) in components[name]?.schema?.properties"
          :key="key"
          class="detail-panel__row-item"
        >
          <el-col :span="6" class="detail-panel__label">{{ item.label }}：</el-col>
          <el-col ref="valueRefs" :span="18" class="detail-panel__value">
            <template v-if="showTooltip[index]">
              <el-tooltip :content="dtoFormData[key]" placement="top-end" effect="dark">
                <span :class="{ ellipsis: showTooltip[index] }">{{ dtoFormData[key] }}</span>
              </el-tooltip>
            </template>
            <template v-else>
              <span>{{ dtoFormData[key] }}</span>
            </template>
          </el-col>
        </el-row>
      </el-card>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, inject, watch, nextTick } from 'vue'
import $curl from '@elpis/common/curl'

const { api, components } = inject('schemaViewData')

const name = ref('detailPanel')

const isShow = ref(false)
const loading = ref(false)
const title = ref('')
const mainKey = ref('')
const mainValue = ref()
const dtoFormData = ref({})

const valueRefs = ref([]) // 存储每个el-col的ref
const showTooltip = ref([]) // 存储每个是否超出
const checkAllOverflow = () => {
  showTooltip.value = valueRefs.value.map((comp) => {
    const el = comp?.$el
    if (el) {
      return el.scrollWidth > el.clientWidth
    }
    return false
  })
}

// 监听数据变化
watch(
  dtoFormData,
  () => {
    nextTick(() => {
      checkAllOverflow()
    })
  },
  { deep: true }
)

const fetchFormData = async () => {
  if (loading.value) return
  loading.value = true
  const res = await $curl({
    method: 'get',
    url: api.value,
    query: {
      [mainKey.value]: mainValue.value
    }
  })
  loading.value = false
  if (!res || !res.success || !res.data) return
  dtoFormData.value = res.data
}

const show = (rowData) => {
  const { config } = components.value[name.value]
  title.value = config.title

  mainKey.value = config.mainKey // 表单主键
  mainValue.value = rowData[mainKey.value] // 表单主键值
  dtoFormData.value = {}

  isShow.value = true

  fetchFormData()
}

defineExpose({
  name,
  show
})
</script>
<style lang="less" scoped>
.detail-panel {
  border: 1px solid #a6a6a6;
  padding: 30px;
  &__row-item {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }
  &__label {
    color: #fff;
  }
  &__value {
    color: #d2dae4;
  }
  .ellipsis {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}
</style>
