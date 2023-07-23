<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue';
import { getUserOrderList } from '@/api/backstage/dataManagement/order.ts';
import { usePageList, useEnums } from '@/composables';

const OrderList = defineAsyncComponent(
  () => import('@/components/order/OrderList.vue')
);

const { orderStatusEnums, getOrderStatusEnums } = useEnums();
getOrderStatusEnums();

const searchForm = reactive({
  state: ''
});

const { reset, page, tableData, handleCurrentChange } = usePageList({
  searchForm,
  getListApi: getUserOrderList
});
reset();
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="text-title">{{ $route.meta.title }}</span>
    </div>

    <el-tabs
      v-model="searchForm.state"
      class="mt-2"
      @tab-change="handleCurrentChange(1)"
    >
      <el-tab-pane label="全部" name=""></el-tab-pane>
      <el-tab-pane
        v-for="item in orderStatusEnums"
        :key="item.id"
        :label="item.name"
        :name="item.code"
      ></el-tab-pane>
    </el-tabs>

    <order-list
      :table-data="tableData"
      class="my-2"
      @refresh-data="handleCurrentChange(1)"
    ></order-list>

    <el-pagination
      background
      hide-on-single-page
      :current-page="page.pageNo"
      :page-size="page.pageSize"
      layout="total,prev, pager, next,jumper"
      :total="page.total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<style scoped lang="scss"></style>
