<template>
  <div>
    <!-- rules: 绑定规则，model：绑定模型对象 -->
    <el-form label-width="80px" :rules="rules" :model="account" ref="formRef">
      <el-form-item label="账号" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" show-password v-model="account.password" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="code-field">
          <el-input v-model="account.code" />
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
import { ElForm, FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { rules } from "../config/login-account-rules";
import { ILogin } from "../types/login";
import useUserStore from "../store/userStore";

const localStorage = useLocalStorage();
const account = reactive({
  name: localStorage.get("username") ?? "",
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
      if (valid) {
        // 记住密码
        if (isKeepPassword) {
          localStorage.set("username", account.name);
          localStorage.set("password", account.password);
        } else {
          localStorage.remove("username");
          localStorage.remove("password");
        }
        userStore.accountLogin(account.name, account.password);
      } else {
        console.log("error submit!", fields);
      }
    });
    return valid;
  },
};
defineExpose(loginCommit);
</script>

<style scoped>
.code-field {
  display: flex;
}

.verify-code {
  padding: 0 5px;
  max-width: 80px;
  max-height: 40px;
}

.verify-code .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.verify-code .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
</style>
