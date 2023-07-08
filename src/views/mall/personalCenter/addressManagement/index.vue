<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { getUserAddressInfoList } from '@/api/backstage/dataManagement/address';
import type { AddressInfo } from '@/api/backstage/dataManagement/address';

const AddressTableList = defineAsyncComponent(
  () => import('@/components/addressTableList/index.vue')
);

const tableData = ref<AddressInfo[]>([]);

const getTableData = () => {
  getUserAddressInfoList().then((res) => {
    tableData.value = res.data || [];
  });
};

getTableData();
</script>

<template>
  <address-table-list
    :table-data="tableData"
    @refresh-data="getTableData"
  ></address-table-list>
</template>

<style lang="scss" scoped></style>
