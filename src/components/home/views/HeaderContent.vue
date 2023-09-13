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
    <section class="header-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :src="userInfo.avatar">
            {{
              userInfo.nickname.length > 2
                ? userInfo.nickname.charAt(0)
                : userInfo.nickname
            }}
          </el-avatar>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>个人设置</el-dropdown-item> -->
            <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from "@/components/login/hooks/useUserInfo";
import { Expand, Fold } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import useUserStore from "@/components/login/store/userStore";
import useLocalStorage from "@/hooks/useLocalStorage";
import router from "@/router";
import { useHomeStore } from "../store/homeStore";

const emit = defineEmits<{ (e: "change", isExpand: boolean): void }>();
const userStore = useUserStore();
const userInfo = useUserInfo();
const homeStore = useHomeStore();

const isExpand = ref(true);

function expandChange() {
  isExpand.value = !isExpand.value;
  emit("change", isExpand.value);
}

function onLogout() {
  userStore.logout().then((respData) => {
    if (respData.isSuccess) {
      router.replace("/login");
      useLocalStorage().clear();
      homeStore.resetMenuIndex();
    }
  });
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
.el-avatar {
  background-color: $primaryColor;
  color: white;
}

.el-dropdown-link:focus {
  outline: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
