<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const BaseHeader = defineAsyncComponent(
  () => import('./components/BaseHeader.vue')
);
const BaseFooter = defineAsyncComponent(
  () => import('./components/BaseFooter.vue')
);
</script>

<template>
  <el-scrollbar :wrap-style="{ height: '100vh' }">
    <div
      class="min-w-[1023px] flex flex-col items-center bg-gray-100 text-black dark:bg-stone-900 dark:text-white"
    >
      <base-header></base-header>

      <router-view />

      <el-divider></el-divider>

      <base-footer></base-footer>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
