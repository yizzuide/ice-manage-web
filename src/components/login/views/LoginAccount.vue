<template>
  <div class="login-form">
    <!-- rules: 绑定规则，model：绑定模型对象，规则和模型字段名要一样 -->
    <el-form label-width="80px" :rules="rules" :model="account" ref="formRef">
      <el-form-item label="账号" prop="username">
        <el-input v-model="account.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" show-password v-model="account.password" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="code-field">
          <el-input v-model="account.code" />
          <span style="width: 1em"></span>
          <el-image
            :src="verifyCodeUrl"
            class="verify-code"
            @click="refreshCode"
          >
            <template #placeholder>
              <div class="image-slot">Loading<span class="dot">...</span></div>
            </template>
          </el-image>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import useLocalStorage from "@/hooks/useLocalStorage";
import { ElForm, ElMessage, FormInstance } from "element-plus";
import { ref } from "vue";
import { rules } from "../config/login-account-rules";
import { ILogin } from "../types/login";
import useUserStore from "../store/userStore";

const localStorage = useLocalStorage();
const account = ref({
  username: localStorage.get("username") ?? "",
  password: localStorage.get("password") ?? "",
  code: "",
});

const verifyCodeUrl = ref("/api/verifyCode/render");
const refreshCode = () => {
  verifyCodeUrl.value = verifyCodeUrl.value + "#1";
};

// InstanceType<typeof ElForm>: 获取ElForm的实例类型（拥有构造函数的实例）
// const formRef = ref<InstanceType<typeof ElForm>>();
const formRef = ref<FormInstance>();
const userStore = useUserStore();

const loginCommit: ILogin = {
  loginAction: async function (isKeepPassword): Promise<boolean> {
    if (!formRef.value) return false;

    const valid = await formRef.value.validate((valid, fields) => {
      if (!valid) {
        return valid;
      }
    });

    if (!valid) {
      ElMessage.error("输入格式不正确！");
      return false;
    }

    // 记住密码
    if (isKeepPassword) {
      localStorage.set("username", account.value.username);
      localStorage.set("password", account.value.password);
    } else {
      localStorage.remove("username");
      localStorage.remove("password");
    }
    const data = await userStore.accountLogin(
      account.value.username,
      account.value.password,
      account.value.code
    );
    if (!data.isSuccess && data.message) {
      ElMessage.error(data.message);
    }
    return data.isSuccess;
  },
};
defineExpose(loginCommit);
</script>

<style scoped lang="scss">
.login-form {
  // :deep：深度子元素选择器
  :deep(.el-input) {
    // 光标颜色
    caret-color: $primaryColor;
  }
}

.code-field {
  display: flex;
}

.verify-code {
  width: 120px;
  height: 32px;

  .image-slot {
    display: flex;
    justify-content: center;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .dot {
    animation: dot 2s infinite steps(3, start);
    overflow: hidden;
  }
}
</style>
