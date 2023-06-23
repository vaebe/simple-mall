<script lang="ts" setup>
import { getSlideshowsByType } from '@/api/backstage/dataManagement/slideshow';
import type { SlideshowInfo } from '@/api/backstage/dataManagement/slideshow';
import { getRandomRecommendedProductList } from '@/api/backstage/dataManagement/product';
import type { ProductInfo } from '@/api/backstage/dataManagement/product';
import { ref, defineAsyncComponent } from 'vue';

const BaseHeader = defineAsyncComponent(
  () => import('@/views/mall/components/BaseHeader.vue')
);
const ProductList = defineAsyncComponent(
  () => import('@/views/mall/components/ProductList.vue')
);

// 获取轮播图列表
const slideshowList = ref<SlideshowInfo[]>([]);
getSlideshowsByType({ type: '02' }).then((res) => {
  slideshowList.value = res.data || [];
});

// 获取推荐商品列表
const recommendedProductList = ref<ProductInfo[]>([]);
const getRecommendedProductList = () => {
  getRandomRecommendedProductList({ total: 20 }).then((res) => {
    recommendedProductList.value = res.data || [];
  });
};
getRecommendedProductList();
</script>

<template>
  <el-scrollbar :wrap-style="{ height: '100vh' }">
    <div
      class="mall-home bg-gray-100 text-black dark:bg-stone-900 dark:text-white"
    >
      <base-header></base-header>

      <div class="px-4 pt-2">
        <el-carousel
          height="70vh"
          class="rounded-xl bg-gray-200 dark:bg-stone-950"
        >
          <el-carousel-item v-for="item in slideshowList" :key="item.id">
            <el-image
              class="w-full"
              :src="item.imageURL"
              fit="contain"
            ></el-image>
          </el-carousel-item>
        </el-carousel>

        <h1 class="text-xl font-medium my-4">为你推荐</h1>

        <!-- 商品列表 -->
        <product-list :product-list="recommendedProductList"></product-list>

        <el-divider></el-divider>

        <div class="pb-4 text-center text-sm text-gray-400">
          <p>Released under the MIT License.</p>
          <p>Copyright © 2023-present vaebe.</p>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.mall-home {
  :deep .el-carousel {
    &__button {
      background-color: var(--el-color-primary);
    }
  }
}
</style>
