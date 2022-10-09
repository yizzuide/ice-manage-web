<template>
  <div class="login-panel">
    <h1 class="title">Ice管理系统</h1>
    <!-- stretch: 内容伸开  -->
    <el-tabs
      type="border-card"
      class="login-tabs"
      stretch
      @tab-click="handleTabSelect"
    >
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><user/></el-icon>
            <span>账号登录</span>
          </span>
        </template>
        <LoginAccount ref="accountRef"></LoginAccount>
      </el-tab-pane>
      <el-tab-pane label="Config">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Iphone/></el-icon>
            <span>手机登录</span>
          </span>
        </template>
        <LoginPhone ref="phoneRef"></LoginPhone>
      </el-tab-pane>
    </el-tabs>
    <div class="login-options" v-if="tabIndex == '0'">
      <el-checkbox v-model="isKeepPassword">记住密码</el-checkbox>
      <el-link>忘记密码？</el-link>
    </div>
    <el-button type="primary" class="login-button" @click="submit"
    >登录
    </el-button
    >
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {User, Iphone} from "@element-plus/icons-vue";
import {TabsPaneContext} from "element-plus";

import LoginAccount from "./LoginAccount.vue";
import LoginPhone from "./LoginPhone.vue";
import {ILogin} from "../types/login";

const accountRef = ref<ILogin>();
const phoneRef = ref<ILogin>();
const loginPanelRefs = [accountRef, phoneRef];
const isKeepPassword = ref(true);
let tabIndex = ref("0");

function handleTabSelect(tab: TabsPaneContext) {
  tabIndex.value = tab.index ?? tabIndex.value;
}

async function submit() {
  const valid = await loginPanelRefs[
    parseInt(tabIndex.value)
    ].value?.loginAction(isKeepPassword.value);
  console.log("valid: ", valid);
}
</script>

<style scoped lang="scss">
.login-panel {
  width: 320px;
  margin-bottom: 150px;

  .title {
    color: $primaryColor;
    text-align: center;
  }
}

.login-tabs {
  > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  .custom-tabs-label {
    .el-icon {
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      margin-left: 4px;
    }
  }
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
