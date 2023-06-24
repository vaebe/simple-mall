<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent } from 'vue';
import {
  getSlideshowsList,
  removeSlideshowInfo
} from '@/api/backstage/dataManagement/slideshow';
import { usePageList } from '@/composables/usePageList';
import { getEnumsByType } from '@/api/backstage/systemManagement/dictionary';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';
import { getCodeNameByCodeId } from '@/utils/tool';

const AddAndViewDialog = defineAsyncComponent(
  () => import('./components/AddAndViewDialog.vue')
);

// 获取轮播图类型枚举
const slideshowTypeList = ref<EnumInfo[]>([]);
const getSlideshowTypeList = () => {
  slideshowTypeList.value = [];
  getEnumsByType({ type: 'slideshowType' }).then((res) => {
    slideshowTypeList.value = res.data || [];
  });
};
getSlideshowTypeList();

const searchForm = reactive({
  description: '',
  type: ''
});

const { reset, page, tableData, handleCurrentChange, removeRow } = usePageList({
  searchForm,
  getListApi: getSlideshowsList,
  removeRowApi: removeSlideshowInfo
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
            <el-form-item label="描述">
              <el-input
                v-model="searchForm.description"
                placeholder="请输入描述"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：">
              <el-select v-model="searchForm.type" placeholder="请选择类型">
                <el-option
                  v-for="item in slideshowTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
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
        <span class="text-title">{{ $route.meta.name }}</span>
        <el-button @click="openAddAndViewDialog('add')">新增</el-button>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" class="my-2">
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column label="轮播图" prop="imageURL" width="100">
          <template #default="scope">
            <el-image :src="scope.row.imageURL" class="w-10 h-10"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          width="200"
        ></el-table-column>
        <el-table-column
          label="跳转链接"
          prop="jumpLink"
          width="200"
        ></el-table-column>
        <el-table-column label="类型" prop="type" width="120">
          <template #default="scope">
            {{ getCodeNameByCodeId(scope.row.type, slideshowTypeList) }}
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
      :slideshow-type-list="slideshowTypeList"
      @refresh-data="reset"
    ></add-and-view-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
