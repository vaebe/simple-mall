<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import type { ShoppingCartInfo } from '@/api/mall/shoppingCart.ts';
import { getUserAddressInfoList } from '@/api/backstage/dataManagement/address.ts';
import type { AddressInfo } from '@/api/backstage/dataManagement/address.ts';
import { formatPicturesInfo, concatenateAddressParts } from '@/utils/tool.ts';
import { createOrder } from '@/api/backstage/dataManagement/order.ts';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';

const emit = defineEmits(['save-success']);

// 地址信息列表
const addressInfoList = ref<AddressInfo[]>([]);

// 选中的地址
const selectedAddress = reactive({}) as AddressInfo;

// 选择地址信息变化
const selectedAddressInfoChange = (data: AddressInfo) => {
  Object.assign(selectedAddress, data);
};

const getAddressInfoList = () => {
  getUserAddressInfoList().then((res) => {
    addressInfoList.value = res.data || [];

    // 设置默认地址
    for (const item of addressInfoList.value) {
      if (item.defaultAddress === '01') {
        selectedAddressInfoChange(item);
      }
    }
  });
};

const products = ref<ShoppingCartInfo[]>([]);
const drawerVisible = ref(false);
const openDialog = (data) => {
  products.value = data;

  getAddressInfoList();
  drawerVisible.value = true;
};

// 总价
const totalPrice = computed(() => {
  return products.value.reduce((accumulator, currentValue) => {
    const product = (currentValue.productInfo.price * currentValue.count) / 100;
    return accumulator + product;
  }, 0);
});

const handleBeforeClose = (done: () => void) => {
  done();
};

// 订单备注
const orderNotes = ref('');

const { getUserInfo } = useUserStore();

const router = useRouter();
//  提交订单
const submitOrder = () => {
  const orderInfoProducts = products.value.map((item) => {
    return {
      count: item.count,
      price: item.productInfo.price,
      productId: item.productId,
      info: item.productInfo.info,
      picture: formatPicturesInfo(item.productInfo.pictures).url,
      name: item.productInfo.name
    };
  });

  const opts = {
    addressId: selectedAddress.id,
    products: orderInfoProducts,
    paymentMethod: '',
    remark: orderNotes.value,
    totalPrice: totalPrice.value * 100,
    userId: getUserInfo().id
  };
  createOrder(opts).then((res) => {
    drawerVisible.value = false;

    emit('save-success');

    // 跳转订单支付页面
    router.push(`/mall/orderPay/${res.data}`);
  });
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    direction="ttb"
    title="订单确认"
    size="100%"
    :before-close="handleBeforeClose"
  >
    <template #default>
      <el-scrollbar>
        <div class="h-full">
          <h1 class="mb-4">请选择收货地址：</h1>
          <ul class="grid grid-cols-4 gap-4">
            <li
              v-for="item in addressInfoList"
              :key="item.id"
              :class="[
                'border dark:border-zinc-800 rounded text-sm relative',
                { 'border-blue-400': item.id === selectedAddress.id }
              ]"
              @click="selectedAddressInfoChange(item)"
            >
              <span
                v-if="item.defaultAddress === '01'"
                class="absolute top-1 right-1 z-10 cursor-pointer px-2 text-xs bg-gray-200 dark:text-black"
              >
                默认
              </span>

              <p class="font-medium pt-4 px-4">
                <span>{{ item.provinceName }}{{ item.cityName }}</span>
                <span class="ml-2">({{ item.name }} 收)</span>
              </p>

              <el-divider direction="horizontal"></el-divider>

              <p class="line-clamp-3 px-2 pb-2 text-xs text-gray-500">
                <span class="mr-2">{{ item.districtName }}</span>
                <span v-if="item.streetName" class="mr-2">
                  {{ item.streetName }}
                </span>
                <span class="mr-2">{{ item.detailedAddress }}</span>
                <span>{{ item.phone }}</span>
              </p>
            </li>
          </ul>

          <div class="flex justify-end mt-2">
            <el-button type="info" link>显示全部地址</el-button>
            <el-button type="success" link>使用新地址</el-button>
            <el-button type="primary" link>管理收货地址</el-button>
          </div>

          <h1 class="mb-4">确认订单信息：</h1>

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
                v-for="item in products"
                :key="item.id"
                class="mb-2 pb-2 flex items-center text-sm border-b border-gray-300 dark:border-zinc-800"
              >
                <el-image
                  class="w-1/12 h20"
                  :src="formatPicturesInfo(item.productInfo.pictures).url"
                  fit="contain"
                ></el-image>
                <p class="w-3/12 ml-2">{{ item.productInfo.name }}</p>
                <p class="w-3/12 ml-2">{{ item.productInfo.info }}</p>
                <p class="w-2/12 ml-2">{{ item.productInfo.price / 100 }}</p>
                <p class="w-2/12 ml-2">{{ item.count }}</p>
                <p class="w-1/12 ml-2 font-medium text-red-500">
                  {{ (item.count * item.productInfo.price) / 100 }}
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
                <span class="text-2xl text-red-500">¥ {{ totalPrice }}</span>
              </p>
              <p class="my-2">
                寄送至:
                <span class="ml-2">
                  {{ concatenateAddressParts(selectedAddress) }}
                  {{ selectedAddress.detailedAddress }}
                </span>
              </p>
              <p>
                收货人:
                <span class="ml-2">
                  {{ selectedAddress.name }} {{ selectedAddress.phone }}
                </span>
              </p>
              <div class="mt-2 flex">
                <p class="w-[100px]">订单备注:</p>
                <el-input
                  v-model="orderNotes"
                  :autosize="{ minRows: 2 }"
                  type="textarea"
                  placeholder="请输入订单备注"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerVisible = false">关闭</el-button>
        <el-button color="red" @click="submitOrder">提交订单</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
