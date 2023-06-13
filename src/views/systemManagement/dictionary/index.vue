<script setup lang="ts">
import { reactive, ref, defineAsyncComponent } from 'vue';
import { usePageList } from '@/composables/usePageList';
import {
  getEnumsList,
  removeEnumInfo
} from '@/api/admin/systemManagement/dictionary';
import type { EnumInfo } from '@/api/admin/systemManagement/dictionary';

const AddAndViewDialog = defineAsyncComponent(
  () => import('./components/AddAndViewDialog.vue')
);

const searchForm = reactive({
  name: '',
  typeName: ''
});

const { reset, page, tableData, handleCurrentChange, removeRow } = usePageList({
  searchForm,
  getListApi: getEnumsList,
  removeRowApi: removeEnumInfo
});
reset();

const addAndViewDialogRef = ref();
const openAddAndViewDialog = (type: string, row?: EnumInfo) => {
  addAndViewDialogRef.value.openDialog(type, row);
};
</script>

<template>
  <div>
    <el-card class="mb-2">
      <el-form :model="searchForm" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="枚举类型：">
              <el-input v-model="searchForm.typeName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="枚举名称：">
              <el-input v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-row :gutter="20" justify="end">
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
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="typeName" label="枚举类型"></el-table-column>
        <el-table-column prop="typeCode" label="枚举类型code"></el-table-column>
        <el-table-column prop="name" label="枚举名称"></el-table-column>
        <el-table-column prop="code" label="枚举code"></el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新日期"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="openAddAndViewDialog('edit', scope.row)"
            >
              编辑
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
