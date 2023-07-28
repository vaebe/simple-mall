<script setup lang="ts">
import { reactive, ref, watch, onBeforeUnmount } from 'vue';
import { getOrderDetails } from '@/api/backstage/dataManagement/order';
import type { OrderDetails } from '@/api/backstage/dataManagement/order';
import { concatenateAddressParts, getCodeNameByCodeId } from '@/utils/tool.ts';
import { weChatPay } from '@/api/mall/orderPay';
import { useEnums } from '@/composables';
import { useWebSocket } from '@vueuse/core';
import { useRouter } from 'vue-router';

const props = defineProps({
  orderId: {
    type: String,
    default: ''
  }
});

const { orderStatusEnums, getOrderStatusEnums } = useEnums();
getOrderStatusEnums();

const QRCodeLoading = ref(false);
const QRCodeUrl = ref('');

// 获取支付二维码
const getPaymentQRCode = () => {
  QRCodeLoading.value = true;
  const opts = {
    info: details.products.map((item) => item.name).join(','),
    orderId: details.id + '',
    price: details.totalPrice
  };
  weChatPay(opts)
    .then((res) => {
      QRCodeUrl.value = res.data.QRcode_url;
    })
    .finally(() => {
      QRCodeLoading.value = false;
    });
};

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

const getDetails = () => {
  if (!props.orderId) {
    return;
  }

  getOrderDetails({ id: parseInt(props.orderId) }).then((res) => {
    Object.assign(details, res.data);

    getPaymentQRCode();
  });
};
getDetails();

const { VITE_APP_WS_URL } = import.meta.env;

const {
  status,
  data: wsData,
  close
} = useWebSocket(`${VITE_APP_WS_URL}?id=${props.orderId}`);

const router = useRouter();

const wsDataWatch = watch(
  () => wsData.value,
  () => {
    console.log(status, wsData);
    if (['OPEN', 'CONNECTING'].includes(status.value)) {
      const res = JSON.parse(wsData.value);
      if (res.type === 'orderPay' && res.code === 0) {
        // todo 跳转支付成功页面
        router.push('/');
      }
    }
  }
);
onBeforeUnmount(() => {
  close();
  wsDataWatch();
});
console.log(props.orderId);
</script>

<template>
  <div class="h-[100vh]">
    <!--   不是待支付状态 -->
    <div v-if="details.state !== '00'">
      <p class="text-4xl">
        订单处于
        {{ getCodeNameByCodeId(details.state, orderStatusEnums) }}
        状态，无法进行支付！
      </p>

      <div class="flex justify-center mt-4">
        <el-button @click="$router.push('/mall')">点击返回首页</el-button>
      </div>
    </div>

    <div v-else>
      <h1 class="font-medium text-lg my-2">订单支付</h1>

      <p class="text-2xl">订单提交成功！确认下方信息无误后进行付款！</p>

      <p class="mt-8 text-red-300">请在30分钟内完成支付, 超时后将取消订单!</p>

      <p class="mt-4">订单编号：{{ details.id }}</p>

      <p class="mt-4">订单金额：{{ details.totalPrice }}元</p>

      <p class="mt-4">
        收货信息：{{ details.addressInfo.name }} {{ details.addressInfo.phone }}
        {{ concatenateAddressParts(details.addressInfo) }}
        {{ details.addressInfo.detailedAddress }}
      </p>

      <div class="flex mt-4">
        <p>商品名称：</p>
        <ul>
          <li
            v-for="item in details.products"
            :key="item.productId"
            class="mb-2"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <p class="font-medium text-lg my-2">请使用微信扫码进行支付</p>
      <div v-loading="QRCodeLoading" style="width: 300px; height: 300px">
        <el-image v-if="QRCodeUrl" :src="QRCodeUrl"></el-image>
      </div>
      <p class="text-sm mt-2">测试阶段，金额后端会强制设置为 0.1 放心支付！</p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
