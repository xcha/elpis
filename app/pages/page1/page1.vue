<template>
    <h1>page1</h1>
    <input type="text">
    <div>{{ content }}</div>
</template>

<script setup>
import { ref } from 'vue'
import utils from '$common/utils'
const content = ref('Page 1 Content')
console.log("page1 init", utils)
</script>

<script>
export default {
    name: 'Page1'
}
</script>

<style lang="less" scoped>
h1 {
    color: red
}
</style>