<template>
  <el-container class="sider-container">
    <el-aside width="200px" class="sider-container__aside">
      <slot name="menu-content"></slot>
    </el-aside>
    <el-main class="sider-container__main">
      <slot name="main-content"></slot>
    </el-main>
  </el-container>
</template>
<script setup></script>
<style lang="less" scoped>
.sider-container {
  height: 100%;
  &__aside {
    border-right: 1px solid #e8e8e8;
  }
  &__main {
    overflow: auto;
  }
}
:deep(.el-menu) {
  border-right: none;
}
</style>
