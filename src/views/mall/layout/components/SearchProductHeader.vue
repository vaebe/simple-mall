<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getAllProductCategoryList } from '@/api/backstage/dataManagement/productCategory.ts';
import type { ProductCategoryInfo } from '@/api/backstage/dataManagement/productCategory.ts';
import { useRouter } from 'vue-router';
import { Search, Expand } from '@element-plus/icons-vue';

// 侧边展示商品分类列表
const showDrawerProductTypeList = ref(false);
const setShowDrawerProductTypeList = () => {
  showDrawerProductTypeList.value = true;
};

const searchForm = reactive({
  name: '',
  pid: undefined
});

// 商品分类列表
const productCategoryInfoList = ref<ProductCategoryInfo[]>([]);
const getProductCategoryInfoList = () => {
  getAllProductCategoryList().then((res) => {
    productCategoryInfoList.value = res.data || [];
  });
};
getProductCategoryInfoList();

const router = useRouter();

// 跳转搜索商品列表
const jumpSearchProductList = () => {
  router.push({ path: '/mall/searchProductList', query: searchForm });
};

// 根据商品分类搜索商品
const searchForProductsByProductCategory = (id) => {
  searchForm.pid = id;
  jumpSearchProductList();
  showDrawerProductTypeList.value = false;
};
</script>

<template>
  <div
    class="mall-base-header w-full px-10 flex items-center justify-between sticky z-50 top-0 border-b border-slate-300 bg-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-900"
  >
    <div class="flex items-center">
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
            @click="searchForProductsByProductCategory(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <el-input
        v-model="searchForm.name"
        placeholder="请输入关键词"
        @keyup.enter="jumpSearchProductList"
      >
        <template #append>
          <el-button :icon="Search" @click="jumpSearchProductList" />
        </template>
      </el-input>
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
          @click="searchForProductsByProductCategory(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
