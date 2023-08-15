<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent } from 'vue';
import { getProductDetails } from '@/api/backstage/dataManagement/product';
import type { ProductInfo } from '@/api/backstage/dataManagement/product';
import { SuccessFilled } from '@element-plus/icons-vue';
import { isVideo } from '@/utils/tool';
import { useUserStore, useShoppingCartStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { addItemToCart, ShoppingCartInfo } from '@/api/mall/shoppingCart';

const OrderConfirmation = defineAsyncComponent(
  () => import('@/components/order/OrderConfirmation.vue')
);

const AreaSelection = defineAsyncComponent(
  () => import('@/components/addressTableList/AreaSelection.vue')
);

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

// 配送区域
const deliveryAreaText = ref('四川 巴中市 恩阳区');
const areaSelectionChange = (_list, text) => {
  deliveryAreaText.value = text;
};

const productDetails = reactive({}) as ProductInfo;

const infoNavList = [
  {
    code: '01',
    name: '商品详情'
  },
  {
    code: '02',
    name: '商品参数'
  }
];

const infoImgList = ref<string[]>([]);
const infoNavType = ref('01');

const infoNavChange = (type: string) => {
  infoNavType.value = type;
  infoImgList.value =
    type === '01'
      ? (productDetails.detailImages as any as string[])
      : (productDetails.parameterImages as any as string[]);
};

getProductDetails({ id: props.id as string }).then((res) => {
  Object.assign(productDetails, res.data);

  productDetails.detailImages = productDetails.detailImages
    ? JSON.parse(productDetails.detailImages)
    : [];

  productDetails.parameterImages = productDetails.parameterImages
    ? JSON.parse(productDetails.parameterImages)
    : [];

  productDetails.pictures = productDetails.pictures.filter(
    (item) => !isVideo(item.url)
  );

  infoNavChange('01');
});

// 购买数量
const purchaseQuantity = ref(1);

const userStore = useUserStore();
const { getUserInfo } = userStore;
const { isLogin } = storeToRefs(userStore);
const router = useRouter();

const { getCartItemsTotal } = useShoppingCartStore();

// 添加到购物车
const addToShoppingCart = () => {
  // 未登录跳转登录页
  if (!isLogin.value) {
    router.push('/login');
    return;
  }
  const opts = {
    count: purchaseQuantity.value,
    productId: productDetails.id,
    userId: getUserInfo().id,
    selected: true
  };

  addItemToCart(opts).then(() => {
    ElMessage.success('加入购物车成功！');

    // 添加商品成功更新商品数量
    getCartItemsTotal();
  });
};

// 立即购买
const orderConfirmationRef = ref();
const buyItNow = () => {
  // 未登录跳转登录页
  if (!isLogin.value) {
    router.push('/login');
    return;
  }

  const data: ShoppingCartInfo = {
    id: 0,
    productId: productDetails.id,
    userId: getUserInfo().id,
    selected: true,
    count: purchaseQuantity.value,
    productInfo: productDetails
  };

  orderConfirmationRef.value.openDialog([data]);
};
</script>

<template>
  <div class="w-full xl:w-10/12 mt-4">
    <div class="flex justify-between mb-4">
      <div class="w-1/2 px-8">
        <el-carousel height="480px" :interval="5000">
          <el-carousel-item
            v-for="item in productDetails.pictures"
            :key="item.id"
          >
            <el-image class="w-full" :src="item.url" fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="w-1/2">
        <p class="text-2xl text-black dark:text-white">
          {{ productDetails.name }}
        </p>

        <p class="text-gray-400 text-sm truncate my-4">
          {{ productDetails.info }}
        </p>

        <div class="mr-4 p-2 rounded bg-slate-100 dark:bg-stone-950">
          <p class="flex items-center">
            <span class="text-sm">售价</span>
            <span class="ml-6 mr-2 text-red-600">¥</span>
            <span class="text-red-600 text-4xl">
              {{ productDetails.price / 100 }}
            </span>
          </p>

          <div class="flex items-center mt-2">
            <p class="text-sm mr-6">服务</p>
            <p class="text-red-500 flex items-center mr-2">
              <el-icon>
                <SuccessFilled />
              </el-icon>
              <span class="text-gray-600 ml-2">满69包邮</span>
            </p>
            <p class="text-red-500 flex items-center mr-2">
              <el-icon>
                <SuccessFilled />
              </el-icon>
              <span class="text-gray-600 ml-2">7天无理由</span>
            </p>

            <p class="text-red-500 flex items-center mr-2">
              <el-icon>
                <SuccessFilled />
              </el-icon>
              <span class="text-gray-600 ml-2">7天价保</span>
            </p>

            <p class="text-red-500 flex items-center mr-2">
              <el-icon>
                <SuccessFilled />
              </el-icon>
              <span class="text-gray-600 ml-2">会员价保+7天</span>
            </p>
          </div>
        </div>

        <div class="flex items-center mt-8">
          <p class="text-sm">配送区域</p>

          <p class="ml-2 cursor-pointer">{{ deliveryAreaText }}</p>

          <p class="mx-2 text-gray-500 text-sm">有货</p>

          <div class="w-10">
            <area-selection @change="areaSelectionChange">
              <p
                class="text-gray-400 text-sm cursor-pointer hover:text-blue-400"
              >
                修改
              </p>
            </area-selection>
          </div>
        </div>

        <div class="mt-4">
          <span class="text-sm mr-6">数量</span>
          <el-input-number
            v-model="purchaseQuantity"
            :min="1"
            :max="productDetails.stock"
          />
        </div>

        <div class="flex mt-10">
          <div
            class="px-8 py-2 cursor-pointer rounded text-white bg-blue-500 hover:bg-blue-400"
            @click="addToShoppingCart"
          >
            加入购物车
          </div>

          <div
            class="ml-4 px-8 py-2 cursor-pointer rounded text-white bg-red-500 hover:bg-red-400"
            @click="buyItNow"
          >
            立即购买
          </div>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div
      class="sticky top-[8vh] z-40 py-2 px-8 flex text-sm bg-slate-200 dark:bg-stone-950"
    >
      <p
        v-for="item in infoNavList"
        :key="item.code"
        :class="[
          'mr-2',
          'cursor-pointer',
          { 'text-blue-400': infoNavType === item.code }
        ]"
        @click="infoNavChange(item.code)"
      >
        {{ item.name }}
      </p>
    </div>
    <div>
      <template v-for="item in infoImgList" :key="item">
        <video v-if="isVideo(item)" :src="item"></video>
        <el-image
          v-else
          class="w-full align-middle"
          :src="item"
          fit="fill"
          :lazy="true"
        ></el-image>
      </template>
    </div>

    <!-- 订单确认 -->
    <order-confirmation ref="orderConfirmationRef"></order-confirmation>
  </div>
</template>

<style lang="scss" scoped></style>
