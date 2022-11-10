<template>
  <div class="logo">
    <img src="@/assets/menu_logo.png" />
    <transition @enter="enterAnimate" @leave="leaveAnimate" :css="false">
      <span class="title" v-if="!collapse">Ice任务管理平台</span>
    </transition>
  </div>
  <div class="divider"></div>
</template>

<script setup lang="ts">
import gsap from "gsap";

defineProps<{ collapse: boolean }>();

function enterAnimate(el: any, done: any) {
  // 定义从哪里来的动画
  gsap.from(el, {
    scale: 0,
    opacity: 0,
    rotation: 360,
    translateX: -100,
    onComplete: done,
  });
}
function leaveAnimate(el: any, done: any) {
  // 定义去哪里的动画
  gsap.to(el, {
    scale: 0,
    opacity: 0,
    rotation: 360,
    translateX: -100,
    onComplete: done,
  });
}
</script>

<style scoped lang="scss">
.logo {
  background-color: saddlebrown;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  color: #fff;

  > img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  span {
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    font-family: "Courier New", Courier, monospace, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
