<template>
  <div class="login-panel">
    <h1 class="title">管理系统</h1>
    <!-- stretch: 内容伸开  -->
    <el-card class="login-card">
      <LoginAccount ref="accountRef"></LoginAccount>
    </el-card>
    <div class="login-options">
      <el-checkbox v-model="isKeepPassword">记住密码</el-checkbox>
      <!-- <el-link>忘记密码？</el-link> -->
    </div>
    <el-button type="primary" class="login-button" @keydown.enter="enterUp"  @click="submit" :disabled="disableLoginButton">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,onUnmounted } from "vue";
import { useRouter } from "vue-router";
import * as routerConfig from "@/router";
import LoginAccount from "./LoginAccount.vue";
import useUserStore from "../store/userStore";


// InstanceType：获取组件构造函数实例类型，从而可以调用组件导出的方法
const accountRef = ref<InstanceType<typeof LoginAccount>>();
const isKeepPassword = ref(true);
const disableLoginButton = ref(false);
const router = useRouter();

onMounted(()=>{
  window.addEventListener("keydown", enterUp);
});

onUnmounted(()=>{
  window.removeEventListener("keydown", enterUp);
});

async function submit() {
  const success = await accountRef.value?.loginAction(isKeepPassword.value);
  if (success) {
    disableLoginButton.value = true;
    // 加载用户详情与菜单
    const userStore = useUserStore();
    Promise.all([
      userStore.fetchUserInfo(true),
      userStore.fetchMenuList(true),
    ]).then(() => {
      // 添加动态路由，使其在首次生效
      routerConfig.addDynamicRoute();
      // 跳转路由路径到主页
      router.push({ name: "index" });
    });
  }
}
async function enterUp(e: KeyboardEvent){
  if(e.key === "Enter") {
    await submit();
  }
}
</script>

<style scoped lang="scss">
.title {
  text-align: center;
  color: $primaryColor;
}

.login-card {
  width: 320px;
}

.login-options {
  display: flex;
  justify-content: space-between;
}

.login-button {
  width: 100%;
  margin-top: 8px;
}
</style>
