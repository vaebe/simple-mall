<script lang="ts" setup>
import { reactive, defineAsyncComponent } from 'vue';
import { getOrderList } from '@/api/backstage/dataManagement/order.ts';
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
  getListApi: getOrderList
});
reset();
</script>

<template>
  <div>
    <el-card class="mb-2">
      <el-form :model="searchForm" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="订单状态：">
              <el-select
                v-model="searchForm.state"
                placeholder="请选择订单状态"
              >
                <el-option
                  v-for="item in orderStatusEnums"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-row type="flex" justify="end">
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="handleCurrentChange(1)">
                查询
              </el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-title">{{ $route.meta.title }}</span>
      </div>

      <order-list
        :table-data="tableData"
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
