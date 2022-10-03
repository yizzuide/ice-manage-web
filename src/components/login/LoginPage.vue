<template>
  <div>Login: {{ userStore.name }}</div>
  <el-button type="primary" @click="changeName">修改</el-button>
  <el-input v-model="input" placeholder="Please input" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRequest } from "../../http/Request";
import useUserStore from "./store/userStore";

const userStore = useUserStore();

function changeName() {
  userStore.name = "yoy";
}

const input = ref("");

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
  });
</script>

<style scoped></style>
