<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent } from 'vue';
import {
  getProductList,
  removeProductInfo
} from '@/api/backstage/dataManagement/product.ts';
import { getProductCategoryList } from '@/api/backstage/dataManagement/productCategory.ts';
import type { ProductCategoryInfo } from '@/api/backstage/dataManagement/productCategory.ts';
import { usePageList } from '@/composables/usePageList.ts';
import { getCodeNameByCodeId, formatPicturesInfo } from '@/utils/tool.ts';

const AddAndViewDialog = defineAsyncComponent(
  () => import('./components/AddAndViewDialog.vue')
);

const productCategoryAll = {
  id: 0,
  name: '全部',
  code: '00',
  sort: 0
};

// 商品分类列表
const productCategoryInfoList = ref<ProductCategoryInfo[]>([]);
const getProductCategoryInfoList = () => {
  const page = {
    pageSize: 999,
    pageNo: 1
  };
  getProductCategoryList(page).then((res) => {
    productCategoryInfoList.value = res.data.list || [];
    productCategoryInfoList.value.unshift(productCategoryAll);
  });
};
getProductCategoryInfoList();

const searchForm = reactive({
  name: '',
  productCategoryId: 0
});

const { reset, page, tableData, handleCurrentChange, removeRow } = usePageList({
  searchForm,
  getListApi: getProductList,
  removeRowApi: removeProductInfo
});
reset();

const addAndViewDialogRef = ref();
const openAddAndViewDialog = (type: string, row?: any) => {
  addAndViewDialogRef.value.openDialog(type, row);
};
</script>

<template>
  <div>
    <el-card class="mb-2">
      <el-form :model="searchForm" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商品名称：">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="商品分类">
              <el-select
                v-model="searchForm.productCategoryId"
                placeholder="请选择商品分类"
              >
                <el-option
                  v-for="item in productCategoryInfoList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
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
      <div class="flex items-center justify-between">
        <span class="text-title">{{ $route.meta.title }}</span>
        <el-button @click="openAddAndViewDialog('add')">新增</el-button>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" class="my-2">
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="name"
          width="200"
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="price"
          width="100"
        ></el-table-column>
        <el-table-column label="商品图片" prop="pictures">
          <template #default="scope">
            <el-image
              :src="formatPicturesInfo(scope.row.pictures).url"
              fit="contain"
              :preview-src-list="formatPicturesInfo(scope.row.pictures).list"
              :preview-teleported="true"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          prop="stock"
          width="100"
        ></el-table-column>
        <el-table-column
          label="商品简介"
          prop="info"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="商品分类" prop="productCategoryId">
          <template #default="scope">
            {{
              getCodeNameByCodeId(
                scope.row.productCategoryId,
                productCategoryInfoList,
                'id',
                'name'
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createdAt"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="openAddAndViewDialog('view', scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="warning"
              link
              @click="openAddAndViewDialog('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="danger"
              link
              @click="removeRow({ id: scope.row.id })"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <add-and-view-dialog
      ref="addAndViewDialogRef"
      :product-category-info-list="productCategoryInfoList"
      @refresh-data="reset"
    ></add-and-view-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
