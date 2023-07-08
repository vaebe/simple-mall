<script lang="ts" setup>
import { reactive, defineAsyncComponent } from 'vue';
import { getAddressList } from '@/api/backstage/dataManagement/address';
import { usePageList } from '@/composables/usePageList';

const AddressTableList = defineAsyncComponent(
  () => import('@/components/addressTableList/index.vue')
);

const searchForm = reactive({
  cityName: '',
  districtName: '',
  provinceName: '',
  streetName: ''
});

const { reset, page, tableData, handleCurrentChange } = usePageList({
  searchForm,
  getListApi: getAddressList
});
reset();
</script>

<template>
  <div>
    <el-card class="mb-2">
      <el-form :model="searchForm" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="省份名称：">
              <el-input
                v-model="searchForm.provinceName"
                placeholder="请输入省份名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市名称：">
              <el-input
                v-model="searchForm.cityName"
                placeholder="请输入市名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县名称：">
              <el-input
                v-model="searchForm.districtName"
                placeholder="请输入区县名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="街道名称：">
              <el-input
                v-model="searchForm.streetName"
                placeholder="请输入街道名称"
              ></el-input>
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
      <address-table-list
        :table-data="tableData"
        :show-add-but="false"
        :show-edit-but="false"
        @refresh-data="handleCurrentChange(1)"
      ></address-table-list>

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
