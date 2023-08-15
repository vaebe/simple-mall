<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const route = useRoute();

const routerList = computed(() => route.matched[2].children);

const router = useRouter();
const jumpPage = (item: RouteRecordRaw) => {
  router.push({ name: item.name });
};
</script>

<template>
  <div class="mt-4 w-full xl:w-10/12 grid grid-cols-6 gap-4">
    <el-card shadow="never" class="min-h-[83vh]">
      <div class="flex justify-center">
        <el-avatar :src="userInfo.avatar" />
      </div>

      <p class="truncate text-center mt-4">{{ userInfo.nickName }}</p>

      <el-divider></el-divider>

      <ul>
        <li
          v-for="item in routerList"
          :key="item.name"
          :class="[
            'cursor-pointer mb-2 hover:text-blue-400',
            { 'text-blue-500': item.name === route.name }
          ]"
          @click="jumpPage(item)"
        >
          {{ item.meta?.title }}
        </li>
      </ul>
    </el-card>

    <el-card shadow="never" class="min-h-[83vh] col-span-5">
      <router-view></router-view>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
