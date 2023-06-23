<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent } from 'vue';
import {
  getProductCategoryList,
  removeProductCategoryInfo
} from '@/api/backstage/dataManagement/productCategory.ts';
import { usePageList } from '@/composables/usePageList.ts';

const AddAndViewDialog = defineAsyncComponent(
  () => import('./components/AddAndViewDialog.vue')
);

const searchForm = reactive({
  nickName: '',
  phoneNumber: '',
  userAccount: ''
});

const { reset, page, tableData, handleCurrentChange, removeRow } = usePageList({
  searchForm,
  getListApi: getProductCategoryList,
  removeRowApi: removeProductCategoryInfo
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
            <el-form-item label="分类名称：">
              <el-input
                v-model="searchForm.userAccount"
                placeholder="请输入分类名称"
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
      <div class="flex items-center justify-between">
        <span class="text-title">{{ $route.meta.name }}</span>
        <el-button @click="openAddAndViewDialog('add')">新增</el-button>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" class="my-2">
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column label="商品分类名称" prop="name"></el-table-column>
        <el-table-column label="商品分类code" prop="code"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
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
      @refresh-data="reset"
    ></add-and-view-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
