<template>
  <h1>page2</h1>
  <input type="text">
  <div>{{ content }}</div>
</template>

<script>
import { ref } from 'vue'
const content = ref('')
console.log("page2 init")
</script>

<style lang="less" scoped>
h1 {
  color: blue
}
</style>