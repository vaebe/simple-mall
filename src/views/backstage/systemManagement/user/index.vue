<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent } from 'vue';
import {
  getUserList,
  removeUser
} from '@/api/backstage/systemManagement/user.ts';
import { usePageList, useEnums } from '@/composables';
import { getCodeNameByCodeId } from '@/utils/tool.ts';

const AddAndViewDialog = defineAsyncComponent(
  () => import('./components/AddAndViewDialog.vue')
);

const { roleList, getRoleList, genderEnums, getGenderEnums } = useEnums();
getRoleList();
getGenderEnums();

const searchForm = reactive({
  nickName: '',
  phoneNumber: '',
  userAccount: ''
});

const { reset, page, tableData, handleCurrentChange, removeRow } = usePageList({
  searchForm,
  getListApi: getUserList,
  removeRowApi: removeUser
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
            <el-form-item label="用户账号：">
              <el-input
                v-model="searchForm.userAccount"
                placeholder="请输入用户账号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号：">
              <el-input
                v-model="searchForm.phoneNumber"
                placeholder="请输入手机号"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="昵称：">
              <el-input
                v-model="searchForm.nickName"
                placeholder="请输入昵称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
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
        <el-table-column label="头像" prop="avatar" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.avatar"
              class="w-10 h-10"
              :lazy="true"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="用户账号" prop="userAccount"></el-table-column>
        <el-table-column label="昵称" prop="nickName"></el-table-column>
        <el-table-column
          label="手机号"
          prop="phoneNumber"
          width="120"
        ></el-table-column>
        <el-table-column label="角色" prop="role" width="100">
          <template #default="scope">
            {{ getCodeNameByCodeId(scope.row.role, roleList, 'code', 'name') }}
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" width="80">
          <template #default="scope">
            {{ getCodeNameByCodeId(scope.row.gender, genderEnums) }}
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
      :role-list="roleList"
      :gender-list="genderEnums"
      @refresh-data="reset"
    ></add-and-view-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
