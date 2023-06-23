<script lang="ts" setup>
import { ref } from 'vue';
import { getRoleInfoList } from '@/api/backstage/systemManagement/role.ts';
import type { RoleInfo } from '@/api/backstage/systemManagement/role.ts';

// 获取角色列表
const roleList = ref<RoleInfo[]>([]);
const getRoleList = () => {
  roleList.value = [];
  getRoleInfoList().then((res) => {
    roleList.value = res.data || [];
  });
};

getRoleList();
</script>

<template>
  <el-card>
    <el-table :data="roleList" stripe>
      <el-table-column type="index" label="序号" width="90"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="角色编码" prop="code"></el-table-column>
      <el-table-column label="角色描述" prop="description"></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createdAt"
        width="180"
      ></el-table-column>
    </el-table>
  </el-card>
</template>

<style lang="scss" scoped></style>
