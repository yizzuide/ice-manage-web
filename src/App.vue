<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

// ElConfigProvider：全局配置对象
// size 用于设置表单组件的默认尺寸（small, middle, large）
// zIndex 用于设置弹出组件的层级，zIndex 的默认值为 2000
const size = "default" as any; // 由于内部是String的封装类型，这里使用any
const zIndex = 3000;
const locale = zhCn;
</script>

<template>
  <div class="app">
    <el-config-provider :size="size" :z-index="zIndex" :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
}
</style>
