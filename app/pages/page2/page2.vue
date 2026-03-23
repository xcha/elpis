<template>
  <h1>page2</h1>
  <input type="text">
  <div>{{ content }}</div>
</template>

<script setup>
import { ref } from 'vue'
const content = ref('Page 2 Content')
console.log("page2 init")
</script>

<script>
export default {
  name: 'Page2'
}
</script>

<style lang="less" scoped>
h1 {
  color: blue
}
</style>