<script lang="ts" setup>
import { getSlideshowsByType } from '@/api/backstage/dataManagement/slideshow';
import type { SlideshowInfo } from '@/api/backstage/dataManagement/slideshow';
import { getRandomRecommendedProductList } from '@/api/backstage/dataManagement/product';
import type { ProductInfo } from '@/api/backstage/dataManagement/product';
import { ref, defineAsyncComponent } from 'vue';

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
  <div class="mall-home px-4 pt-2">
    <el-carousel height="70vh" class="rounded-xl bg-gray-200 dark:bg-stone-950">
      <el-carousel-item v-for="item in slideshowList" :key="item.id">
        <el-image class="w-full" :src="item.imageURL" fit="contain"></el-image>
      </el-carousel-item>
    </el-carousel>

    <h1 class="text-xl font-medium my-4">为你推荐</h1>

    <!-- 商品列表 -->
    <product-list :product-list="recommendedProductList"></product-list>

    <div class="flex justify-center mt-4">
      <el-button @click="getRecommendedProductList">重新获取</el-button>
    </div>
  </div>
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
