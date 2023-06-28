<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { getAllProductCategoryList } from '@/api/backstage/dataManagement/productCategory';
import type { ProductCategoryInfo } from '@/api/backstage/dataManagement/productCategory';
import { useUserStore, useShoppingCartStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ShoppingCart } from '@element-plus/icons-vue';

const ThemeSwitch = defineAsyncComponent(
  () => import('@/components/ThemeSwitch.vue')
);

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

// 商品分类列表
const productCategoryInfoList = ref<ProductCategoryInfo[]>([]);
const getProductCategoryInfoList = () => {
  getAllProductCategoryList().then((res) => {
    productCategoryInfoList.value = res.data || [];
  });
};
getProductCategoryInfoList();

const shoppingCartStore = useShoppingCartStore();
const { cartItemsTotal } = storeToRefs(shoppingCartStore);

const router = useRouter();

// 跳转登录
const jumpLogin = () => {
  router.push('/login');
};

// 跳转注册
const jumpRegister = () => {
  router.push('/userRegister');
};
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

    <div class="flex items-center">
      <p v-if="!isLogin" class="mr-2">
        <span class="cursor-pointer hover:text-blue-400" @click="jumpLogin">
          登录
        </span>
        <span
          class="ml-2 cursor-pointer hover:text-blue-400"
          @click="jumpRegister"
        >
          注册
        </span>
      </p>

      <el-badge v-else :value="12" class="ml-2 mr-6">
        <el-icon :size="cartItemsTotal"><ShoppingCart /></el-icon>
      </el-badge>

      <theme-switch></theme-switch>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
