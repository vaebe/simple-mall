<script setup lang="ts">
import { reactive, ref } from 'vue';
import { getOrderDetails } from '@/api/backstage/dataManagement/order.ts';
import type { OrderDetails } from '@/api/backstage/dataManagement/order.ts';
import { concatenateAddressParts } from '@/utils/tool.ts';

const details = reactive({
  id: 0,
  createdAt: '',
  updatedAt: '',
  userId: 0,
  state: '',
  totalPrice: 0,
  remark: '',
  addressId: 0,
  paymentMethod: '',
  shippingMethod: '',
  products: [],
  addressInfo: {}
}) as OrderDetails;
const getDetails = (id: number) => {
  getOrderDetails({ id }).then((res) => {
    Object.assign(details, res.data);
  });
};

const drawerVisible = ref(false);
const openDialog = (id: number) => {
  getDetails(id);
  drawerVisible.value = true;
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-drawer
    v-if="drawerVisible"
    v-model="drawerVisible"
    direction="ltr"
    title="订单详情"
    size="100%"
  >
    <template #default>
      <el-scrollbar>
        <div class="h-full">
          <h1 class="mb-4">
            <span>订单日期：{{ details.createdAt }}</span>
          </h1>

          <div class="border dark:border-zinc-800 rounded p-2">
            <ul>
              <li
                class="mb-2 pb-2 flex items-center border-b border-gray-300 dark:border-zinc-800"
              >
                <p class="w-1/12 h20">商品图片</p>
                <p class="w-3/12 ml-2">名称</p>
                <p class="w-3/12 ml-2">描述</p>
                <p class="w-2/12 ml-2">价格</p>
                <p class="w-2/12 ml-2">数量</p>
                <p class="w-1/12 ml-2">小计</p>
              </li>
              <li
                v-for="item in details.products"
                :key="item.productId"
                class="mb-2 pb-2 flex items-center text-sm border-b border-gray-300 dark:border-zinc-800"
              >
                <el-image
                  class="w-1/12 h20"
                  :src="item.picture"
                  fit="contain"
                ></el-image>
                <p class="w-3/12 ml-2">{{ item.name }}</p>
                <p class="w-3/12 ml-2">{{ item.info }}</p>
                <p class="w-2/12 ml-2">{{ item.price / 100 }}</p>
                <p class="w-2/12 ml-2">{{ item.count }}</p>
                <p class="w-1/12 ml-2 font-medium text-red-500">
                  {{ (item.count * item.price) / 100 }}
                </p>
              </li>
            </ul>
          </div>

          <div class="flex justify-end mt-4">
            <div
              class="p-2 min-w-[40%] max-w-[50%] text-sm rounded border dark:border-zinc-800"
            >
              <p class="flex items-center">
                实付款：
                <span class="text-2xl text-red-500">
                  ¥ {{ details.totalPrice }}
                </span>
              </p>
              <p class="my-2">
                寄送至:
                <span class="text-gray-500">
                  {{ concatenateAddressParts(details.addressInfo) }}
                  {{ details.addressInfo.detailedAddress }}
                </span>
              </p>
              <p>
                收货人:
                <span class="text-gray-500">
                  {{ details.addressInfo.name }} {{ details.addressInfo.phone }}
                </span>
              </p>
              <div class="mt-2 flex">
                <p class="w-[100px]">订单备注:</p>
                {{ details.remark }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerVisible = false">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
