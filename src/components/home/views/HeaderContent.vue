<template>
  <div class="header-container">
    <section class="header-left">
      <span @click="expandChange">
        <el-icon>
          <Expand v-if="isExpand" />
          <Fold v-else />
        </el-icon>
      </span>
      <slot></slot>
    </section>
    <section class="header-right">个人中心</section>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold } from "@element-plus/icons-vue";
import { ref } from "vue";

const emit = defineEmits<{ (e: "change", isExpand: boolean): void }>();

const isExpand = ref(true);

function expandChange() {
  isExpand.value = !isExpand.value;
  emit("change", isExpand.value);
}
</script>

<style scoped lang="scss">
.header-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left:hover {
  cursor: pointer;
}
.header-left {
  line-height: 50px;
}
</style>
