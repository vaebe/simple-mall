<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { getAllProductCategoryList } from '@/api/backstage/dataManagement/productCategory';
import type { ProductCategoryInfo } from '@/api/backstage/dataManagement/productCategory';
import { useUserStore, useShoppingCartStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ShoppingCart, Search, Expand } from '@element-plus/icons-vue';

const ThemeSwitch = defineAsyncComponent(
  () => import('@/components/ThemeSwitch.vue')
);

// 侧边展示商品分类列表
const showDrawerProductTypeList = ref(false);
const setShowDrawerProductTypeList = () => {
  showDrawerProductTypeList.value = true;
};

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
const { getCartItemsTotal } = shoppingCartStore;
const { cartItemsTotal } = storeToRefs(shoppingCartStore);
getCartItemsTotal();

const router = useRouter();

// 搜索文本
const searchText = ref('');

// 跳转搜索商品列表
const jumpSearchProductList = () => {
  router.push(`/mall/searchProductList/${searchText.value}`);
};

// 根据商品分类搜索商品
const searchForProductsByProductCategory = (productCategory: string) => {
  searchText.value = productCategory;
  jumpSearchProductList();
  showDrawerProductTypeList.value = false;
};

// 跳转登录
const jumpLogin = () => {
  router.push('/login');
};

// 跳转注册
const jumpRegister = () => {
  router.push('/userRegister');
};

// 跳转购物车
const jumpShoppingCart = () => {
  router.push('/mall/shoppingCart');
};
</script>

<template>
  <div
    class="mall-base-header w-full px-2 flex items-center justify-between sticky z-50 top-0 border-b border-slate-300 bg-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-900"
  >
    <div class="flex items-center">
      <el-image src="/vite.svg" fit="fill"></el-image>

      <div class="block lg:hidden py-3">
        <el-icon size="30" @click="setShowDrawerProductTypeList">
          <Expand />
        </el-icon>
      </div>

      <div class="hidden lg:block">
        <ul class="flex items-center">
          <li
            v-for="item in productCategoryInfoList"
            :key="item.id"
            class="last:ml-0 py-4 px-2 text-lg font-medium cursor-pointer border-transparent border-b-2 hover:border-black"
            @click="searchForProductsByProductCategory(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="flex items-center">
      <div class="mr-2">
        <el-input
          v-model="searchText"
          placeholder="请输入关键词"
          @keyup.enter="jumpSearchProductList"
        >
          <template #append>
            <el-button :icon="Search" @click="jumpSearchProductList" />
          </template>
        </el-input>
      </div>

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

      <el-badge v-else :value="cartItemsTotal" class="ml-2 mr-6">
        <el-icon class="cursor-pointer" :size="26" @click="jumpShoppingCart">
          <ShoppingCart />
        </el-icon>
      </el-badge>

      <theme-switch></theme-switch>
    </div>

    <el-drawer
      v-model="showDrawerProductTypeList"
      :with-header="false"
      direction="ltr"
    >
      <ul class="">
        <li
          v-for="item in productCategoryInfoList"
          :key="item.id"
          class="last:ml-0 py-4 px-2 text-lg font-medium cursor-pointer border-transparent border-b-2 hover:border-black"
          @click="searchForProductsByProductCategory(item.name)"
        >
          {{ item.name }}
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
