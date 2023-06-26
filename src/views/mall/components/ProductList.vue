<script lang="ts" setup>
import type { PropType } from 'vue';
import type {
  ProductInfo,
  ProductInfoPictures
} from '@/api/backstage/dataManagement/product';
import { useRouter } from 'vue-router';

defineProps({
  productList: {
    type: Array as PropType<ProductInfo[]>,
    default: () => {
      return {};
    }
  }
});

const gteProductImg = (pictures: ProductInfoPictures[]) => {
  const data = pictures.filter((item) => item.type !== 'mp4');
  return data[0].url || '';
};

const router = useRouter();
const jumpToDetails = (id: number) => {
  router.push(`/mall/productDetails/${id}`);
};
</script>

<template>
  <ul
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
  >
    <li
      v-for="item in productList"
      :key="item.id"
      class="h-[28rem] rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800 dark:text-white"
      @click="jumpToDetails(item.id)"
    >
      <el-image
        class="w-full h-[22rem]"
        :src="gteProductImg(item.pictures)"
        fit="fill"
      ></el-image>

      <div class="text-center px-2">
        <p class="font-medium truncate">{{ item.name }}</p>
        <p class="my-2 truncate text-slate-400 text-sm">{{ item.info }}</p>
        <p class="truncate">¥ {{ item.price / 100 }}</p>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped></style>
