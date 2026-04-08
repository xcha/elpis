<template>
  <el-select v-model="dtoValue" :placeholder="placeholder" class="dynamic-select" clearable>
    <el-option v-for="item in enumList" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$common/curl.js'

const props = defineProps({
  schemaKey: String,
  schema: Object
});

const emit = defineEmits(['loaded']);

const dtoValue = ref();
const enumList = ref([]);

const getValue = () => {
  return dtoValue.value !== undefined && dtoValue.value !== null && dtoValue.value !== ''
    ? { [props.schemaKey]: dtoValue.value }
    : {}
};

const reset = () => {
  dtoValue.value = props.schema?.option?.default ?? enumList.value[0]?.value;
};

const placeholder = props.schema?.option?.placeholder || '请选择';

const fetchEnumList = async () => {
  const api = props.schema?.option?.api;
  if (!api) return;

  const res = await $curl({
    method: 'get',
    url: api,
  });

  if (res?.data?.length > 0) {
    enumList.value = res.data;  // 直接赋值，不要用 push
  }
}

onMounted(async () => {
  await fetchEnumList();
  reset();
  emit('loaded');
});

defineExpose({
  getValue,
  reset
});
</script>

<style lang="less" scoped>
.dynamic-select {
  width: 180px;
}
</style>