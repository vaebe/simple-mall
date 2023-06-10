<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
import { useUserStore } from '@/store';

const { VITE_APP_TITLE } = import.meta.env;

const { loginOut } = useUserStore();

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
<template>
  <div class="header-box">
    <div class="ml-4 font-medium text-2xl">
      <p>{{ VITE_APP_TITLE }}</p>
    </div>

    <div class="flex items-center justify-end pr-4">
      <el-button @click="toggleDark()">
        {{ isDark ? '深夜' : '黎明' }}
      </el-button>

      <el-icon color="red" :size="20" class="ml-4" @click="loginOut">
        <circle-close />
      </el-icon>
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
