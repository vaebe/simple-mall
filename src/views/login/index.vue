<script lang="ts" setup>
import { queryList } from '@/api/test';
import type { QueryListResListItem } from '@/api/test';
import { ref } from 'vue';

const resList = ref<QueryListResListItem[]>([]);
const getList = () => {
  queryList().then((res) => {
    resList.value = res.data.list;
  });
};
</script>

<template>
  <el-button type="primary" @click="getList">获取列表</el-button>

  <ul>
    <li v-for="(item, index) in resList" :key="index">
      {{ item.name }}\{{ item.address }}
    </li>
  </ul>
</template>

<style lang="scss" scoped></style>
