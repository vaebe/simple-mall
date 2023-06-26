<script lang="ts" setup>
import { defineAsyncComponent, reactive, ref } from 'vue';
import { getProductDetails } from '@/api/backstage/dataManagement/product';
import type { ProductInfo } from '@/api/backstage/dataManagement/product';
import { SuccessFilled } from '@element-plus/icons-vue';

const BaseHeader = defineAsyncComponent(
  () => import('@/views/mall/components/BaseHeader.vue')
);
const BaseFooter = defineAsyncComponent(
  () => import('@/views/mall/components/BaseFooter.vue')
);

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

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

getProductDetails({ id: props.id }).then((res) => {
  Object.assign(productDetails, res.data);

  productDetails.detailImages = JSON.parse(productDetails.detailImages);

  productDetails.parameterImages = JSON.parse(productDetails.parameterImages);

  productDetails.pictures = productDetails.pictures.filter(
    (item) => item.type !== 'mp4'
  );

  infoNavChange('01');
});

// 购买数量
const purchaseQuantity = ref(1);
</script>

<template>
  <div class="product-details">
    <base-header></base-header>

    <div class="w-full flex flex-col items-center">
      <div class="w-full xl:w-10/12 mt-4">
        <div class="flex justify-between mb-4">
          <div class="w-1/2 px-8">
            <el-carousel height="380px" :interval="5000">
              <el-carousel-item
                v-for="item in productDetails.pictures"
                :key="item.id"
              >
                <el-image
                  class="w-full"
                  :src="item.url"
                  fit="contain"
                ></el-image>
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
                  <el-icon><SuccessFilled /></el-icon>
                  <span class="text-gray-600 ml-2">满69包邮</span>
                </p>
                <p class="text-red-500 flex items-center mr-2">
                  <el-icon><SuccessFilled /></el-icon>
                  <span class="text-gray-600 ml-2">7天无理由</span>
                </p>

                <p class="text-red-500 flex items-center mr-2">
                  <el-icon><SuccessFilled /></el-icon>
                  <span class="text-gray-600 ml-2">7天价保</span>
                </p>

                <p class="text-red-500 flex items-center mr-2">
                  <el-icon><SuccessFilled /></el-icon>
                  <span class="text-gray-600 ml-2">会员价保+7天</span>
                </p>
              </div>
            </div>

            <!-- 地址选择 todo 待实现-->
            <div class="flex items-center mt-8">
              <p class="text-sm">配送区域</p>

              <p class="ml-2 cursor-pointer">四川 巴中市 恩阳区</p>

              <p class="mx-2 text-gray-500 text-sm">有货</p>

              <p
                class="text-gray-400 text-sm cursor-pointer hover:text-blue-400"
              >
                修改
              </p>
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
              >
                加入购物车
              </div>

              <div
                class="ml-4 px-8 py-2 cursor-pointer rounded text-white bg-red-500 hover:bg-red-400"
              >
                立即购买
              </div>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="sticky top-[8vh] z-40 py-2 px-8 flex text-sm bg-slate-100">
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
            <video v-if="item.includes('mp4')" :src="item"></video>
            <el-image
              v-else
              class="w-full align-middle"
              :src="item"
              fit="fill"
              :lazy="true"
            ></el-image>
          </template>
        </div>
      </div>
    </div>

    <el-divider></el-divider>

    <base-footer></base-footer>
  </div>
</template>

<style lang="scss" scoped></style>
