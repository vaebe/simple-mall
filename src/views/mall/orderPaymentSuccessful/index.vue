<script setup lang="ts">
import { getRandomRecommendedProductList } from '@/api/backstage/dataManagement/product';
import type { ProductInfo } from '@/api/backstage/dataManagement/product';
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import weChatPaySuccessIcon from '@/assets/img/weChatPaySuccessIcon.png';

const ProductList = defineAsyncComponent(
  () => import('@/views/mall/components/ProductList.vue')
);
const OrderDetails = defineAsyncComponent(
  () => import('@/components/order/OrderDetails.vue')
);

const props = defineProps({
  orderId: {
    type: String,
    default: ''
  }
});

// 获取推荐商品列表
const recommendedProductList = ref<ProductInfo[]>([]);
const getRecommendedProductList = () => {
  getRandomRecommendedProductList({ total: 20 }).then((res) => {
    recommendedProductList.value = res.data || [];
  });
};
getRecommendedProductList();

const orderDetailsRef = ref();
// 打开详情弹窗
const openOrderDetailsDialog = () => {
  orderDetailsRef.value.openDialog(props.orderId);
};

const router = useRouter();
// 返回首页
const jumpHome = () => {
  router.push('/home');
};
</script>

<template>
  <div>
    <el-card class="mt-4">
      <div class="flex flex-col items-center mb-10">
        <h1 class="text-center text-xl font-medium mb-4">
          支付成功,商品将尽快送到您的手中！
        </h1>

        <el-image style="width: 60px" :src="weChatPaySuccessIcon"></el-image>
      </div>

      <div class="flex justify-center">
        <el-button class="ml-4" round @click="openOrderDetailsDialog">
          查看订单
        </el-button>
        <el-button type="primary" round @click="jumpHome">返回首页</el-button>
      </div>
    </el-card>

    <h1 class="text-xl font-medium my-4">为你推荐</h1>

    <!-- 商品列表 -->
    <product-list :product-list="recommendedProductList"></product-list>

    <order-details ref="orderDetailsRef"></order-details>
  </div>
</template>

<style scoped lang="scss"></style>
