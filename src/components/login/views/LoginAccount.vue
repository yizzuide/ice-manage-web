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
import { HttpResult } from "@/http/HttpDefine";
import { ElForm, ElMessage, FormInstance } from "element-plus";
import { ref } from "vue";
import { rules } from "../config/login-account-rules";
import useUserStore from "../store/userStore";

const localStorage = useLocalStorage();
const account = ref({
  username: localStorage.get("username") ?? "admin",
  password: localStorage.get("password") ?? "123456",
  code: "",
  uuid: "",
});

const getUUID = () => {
  const s: (number | any)[] = [];
  const x = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = x.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = x.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join("");
  return uuid;
};

const uuid = getUUID();
const verifyCodeUrl = ref("/api/code/render/");
verifyCodeUrl.value = verifyCodeUrl.value + uuid;
account.value.uuid = uuid;

const refreshCode = () => {
  const uuid = getUUID();
  verifyCodeUrl.value = `/api/code/render/${uuid}`;
  account.value.uuid = uuid;
};

// InstanceType<typeof ElForm>: 获取ElForm的实例类型（拥有构造函数的实例）
// const formRef = ref<InstanceType<typeof ElForm>>();
const formRef = ref<FormInstance>();
const userStore = useUserStore();

async function loginAction(isKeepPassword: boolean) {
  // 校验方法为异步
  const valid = await formRef.value?.validate();
  if (!valid) {
    ElMessage.error("输入格式不正确！");
    return Promise.resolve(false);
  }

  // 记住密码
  if (isKeepPassword) {
    localStorage.set("username", account.value.username);
    localStorage.set("password", account.value.password);
  } else {
    localStorage.remove("username");
    localStorage.remove("password");
  }
  // 登录会有401 reject，这里要捕捉异常
  try {
    const data = await userStore.accountLogin(
      account.value.username,
      account.value.password,
      account.value.code,
      account.value.uuid
    );
    return Promise.resolve(data.isSuccess);
  } catch (error) {
    return Promise.resolve(false);
  }
}
defineExpose({ loginAction });
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
