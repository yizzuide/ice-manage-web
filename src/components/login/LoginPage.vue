<template>
  <div class="login">
    <LoginPanel></LoginPanel>
  </div>
</template>

<script setup lang="ts">
import LoginPanel from "./views/LoginPanel.vue";
/*
const userStore = useUserStore();
useRequest()
  .request<Array<object>>({
    url: "/api/sundial/getAll",
    method: "get",
    showLoading: true,
    interceptor: {
      onRequest: (config) => {
        const { url, method } = config;
        console.log("当前请求拦截: ", url, "showLoading: ", config.showLoading);
        return config;
      },
    },
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  }); */
</script>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.svg") no-repeat 50% 50% / 100% 100% fixed;
}
</style>
