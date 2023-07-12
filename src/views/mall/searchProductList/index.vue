<script lang="ts" setup>
import { defineAsyncComponent, reactive, watch, onBeforeUnmount } from 'vue';
import { getProductList } from '@/api/backstage/dataManagement/product';
import { usePageList } from '@/composables/usePageList';
import { useRoute } from 'vue-router';

const ProductList = defineAsyncComponent(
  () => import('@/views/mall/components/ProductList.vue')
);

const searchForm = reactive({
  name: '',
  productCategoryId: 0
});

const { page, tableData, handleCurrentChange } = usePageList({
  searchForm,
  getListApi: getProductList
});

const route = useRoute();

const routeWatch = watch(
  () => route.query,
  () => {
    const { name, pid } = route.query;
    if (name || pid) {
      searchForm.name = (name as string) || '';
      searchForm.productCategoryId = pid ? Number(pid) : 0;
      handleCurrentChange(1);
    }
  },
  { immediate: true, deep: true }
);

onBeforeUnmount(() => {
  routeWatch();
});
</script>

<template>
  <div class="searchProductList w-full flex flex-col items-center">
    <div v-if="tableData.length !== 0" class="w-full xl:w-10/12 mt-4">
      <product-list :product-list="tableData"></product-list>

      <div class="mt-4 flex justify-center">
        <el-pagination
          hide-on-single-page
          :current-page="page.pageNo"
          :page-size="page.pageSize"
          layout="total,prev, pager, next,jumper"
          :total="page.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <div v-else class="h-[40rem]">没有符合条件的商品~</div>
  </div>
</template>

<style lang="scss" scoped></style>
