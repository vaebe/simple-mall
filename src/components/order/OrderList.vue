<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { PropType } from 'vue';
import type { OrderInfo } from '@/api/backstage/dataManagement/order.ts';

const OrderListItem = defineAsyncComponent(() => import('./OrderListItem.vue'));

defineProps({
  tableData: {
    type: Array as PropType<OrderInfo[]>,
    default: () => {
      return [];
    }
  }
});
</script>

<template>
  <div>
    <ul class="py-1 px-2 grid grid-cols-12 gap-4 bg-zinc-100 dark:bg-zinc-900">
      <li class="col-span-1">商品</li>
      <li class="col-span-3">名称</li>
      <li class="col-span-5">商品描述</li>
      <li class="col-span-1">单价</li>
      <li class="col-span-1">数量</li>
      <li class="col-span-1">小计</li>
    </ul>
    <order-list-item
      v-for="item in tableData"
      :key="item.id"
      :item-data="item"
    ></order-list-item>
  </div>
</template>

<style scoped lang="scss"></style>
