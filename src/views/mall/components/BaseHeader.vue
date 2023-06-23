<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { getAllProductCategoryList } from '@/api/admin/dataManagement/productCategory';
import type { ProductCategoryInfo } from '@/api/admin/dataManagement/productCategory';

const ThemeSwitch = defineAsyncComponent(
  () => import('@/components/ThemeSwitch.vue')
);

// 商品分类列表
const productCategoryInfoList = ref<ProductCategoryInfo[]>([]);
const getProductCategoryInfoList = () => {
  getAllProductCategoryList().then((res) => {
    productCategoryInfoList.value = res.data || [];
  });
};
getProductCategoryInfoList();
</script>

<template>
  <div
    class="mall-base-header w-full px-2 flex items-center justify-between sticky z-50 top-0 border-b border-slate-300 bg-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-900"
  >
    <div class="flex items-center">
      <el-image src="/public/vite.svg" fit="fill"></el-image>
      <ul class="flex items-center">
        <li
          v-for="item in productCategoryInfoList"
          :key="item.id"
          class="last:ml-0 py-4 px-2 text-lg font-medium cursor-pointer border-transparent border-b-2 hover:border-black"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

    <div>
      <theme-switch></theme-switch>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
