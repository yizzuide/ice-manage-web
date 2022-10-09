<template>
  <div>
    <el-form label-width="80px" :rules="rules" :model="user">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.number="user.phone"/>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="code-field">
          <el-input v-model.number="user.code" class="code-field-input"/>
          <el-button type="primary">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {rules} from "../config/login-phone-rules";

const user = reactive({
  phone: "",
  code: "",
});
</script>

<style scoped lang="scss">
.code-field {
  display: flex;

  .code-field-input {
    margin-right: 8px;
  }
}
</style>
