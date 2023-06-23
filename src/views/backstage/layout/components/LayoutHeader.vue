<script lang="ts" setup>
import { useUserStore } from '@/store';
import { defineAsyncComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

const ThemeSwitch = defineAsyncComponent(
  () => import('@/components/ThemeSwitch.vue')
);

const { VITE_APP_TITLE } = import.meta.env;

const { loginOut, getUserInfo } = useUserStore();
const userInfo = reactive(getUserInfo());

const router = useRouter();
const jumpHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="header-box">
    <div class="ml-4 flex items-center">
      <el-image class="h-8 mr-2" src="/public/vite.svg" fit="fill"></el-image>
      <p class="cursor-pointer font-medium text-2xl" @click="jumpHome">
        {{ VITE_APP_TITLE }}
      </p>
    </div>

    <div class="flex items-center justify-end pr-4">
      <theme-switch></theme-switch>

      <div class="user-info">
        <el-popover placement="bottom" :width="100" trigger="hover">
          <ul class="text-center">
            <li class="mb-2 truncate">{{ userInfo.nickName }}</li>
            <li class="cursor-pointer hover:text-blue-400" @click="loginOut">
              退出登录
            </li>
          </ul>

          <template #reference>
            <el-image
              class="h-8 w-8 rounded-full ml-2"
              :src="userInfo.avatar"
              fit="fill"
            ></el-image>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 7vh;
  color: var(--el-text-color-regular);
  background: var(--el-bg-color);
  border-bottom: var(--el-border);
}
</style>
