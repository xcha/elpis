<template>
  <el-container class="header-container">
    <el-header class="header-container__header">
      <el-row type="flex" align="middle" class="header-container__row">
        <!-- 左上方 title -->
        <el-row type="flex" align="middle" class="header-container__left">
          <img src="./assets/logo.png" class="header-container__left-logo" />
          <el-row class="header-container__left-title">{{ title }}</el-row>
        </el-row>
        <!-- 插槽：菜单区域 -->
        <slot name="menu-content"></slot>
        <!-- 右上方区域 -->
        <el-row type="flex" align="middle" class="header-container__right" justify="end">
          <!-- 插槽：设置区域 -->
          <slot name="setting-content"></slot>
          <component
            :is="BussinessHeaderConfig.userPanel.component"
            v-if="BussinessHeaderConfig?.userPanel"
          ></component>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="header-container__main">
      <!-- 插槽：核心内容填充区域 -->
      <slot name="main-content"></slot>
    </el-main>
  </el-container>
</template>

<script setup>
import BussinessHeaderConfig from '@bussinessHeaderConfig'
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;
  &__header {
    max-height: 120px;
    border-bottom: 1px solid #e8e8e8;
  }
  &__row {
    height: 60px;
    padding: 0 20px;
  }
  &__left {
    width: 180px;
    min-width: 180px;
    &-logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      border-radius: 50%;
    }
    &-title {
      font-size: 15px;
      font-weight: 500;
    }
  }
  &__right {
    margin-left: auto;
    min-width: 180px;
  }
}
:deep(.el-header) {
  padding: 0;
}
</style>
