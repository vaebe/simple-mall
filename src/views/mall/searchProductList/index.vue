<script lang="ts" setup>
import { defineAsyncComponent, reactive } from 'vue';
import { getProductList } from '@/api/backstage/dataManagement/product';
import { usePageList } from '@/composables/usePageList';
import { useRoute } from 'vue-router';

const BaseHeader = defineAsyncComponent(
  () => import('@/views/mall/components/BaseHeader.vue')
);
const ProductList = defineAsyncComponent(
  () => import('@/views/mall/components/ProductList.vue')
);

const searchForm = reactive({
  name: ''
});

const { page, tableData, handleCurrentChange } = usePageList({
  searchForm,
  getListApi: getProductList
});

const route = useRoute();
const keyword = route.params.keyword as string;
if (keyword) {
  searchForm.name = keyword;
  handleCurrentChange(1);
}
</script>

<template>
  <el-scrollbar :wrap-style="{ height: '100vh' }">
    <div class="searchProductList w-full flex flex-col items-center">
      <base-header></base-header>

      <div class="w-full xl:w-10/12 mt-4">
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
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
