<template>
    <h1>page1</h1>
    <input type="text">
    <div>{{ content }}</div>
</template>

<script>
import { ref } from 'vue'
const content = ref('')
console.log("page1 init")
import utils from '$common/utils'   
</script>

<style lang="less" scoped>
h1 {
    color: red
}
</style>