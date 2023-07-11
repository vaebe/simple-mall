<script setup lang="ts">
import type { PropType } from 'vue';
import type { OrderInfo } from '@/api/backstage/dataManagement/order.ts';
import { useEnums } from '@/composables';
import { getCodeNameByCodeId } from '@/utils/tool.ts';

defineProps({
  itemData: {
    type: Object as PropType<OrderInfo>,
    default: () => {
      return {};
    }
  }
});

const { orderStatusEnums, getOrderStatusEnums } = useEnums();
getOrderStatusEnums();
</script>

<template>
  <div class="mt-2 border dark:border-zinc-800 rounded">
    <div class="p-2 flex justify-between bg-gray-50 text-sm dark:bg-zinc-800">
      <div class="flex">
        {{ itemData.createdAt }}

        <p class="mx-6">订单号： {{ itemData.id }}</p>

        <p>状态：{{ getCodeNameByCodeId(itemData.state, orderStatusEnums) }}</p>

        <p class="ml-6">
          订单金额：
          <span class="text-red-500">{{ itemData.totalPrice }}</span>
        </p>
      </div>

      <el-button link>查看</el-button>
    </div>
    <ul
      v-for="productItem in itemData.products"
      :key="productItem.productId"
      class="p-2 grid grid-cols-12 gap-4 text-xs"
    >
      <li class="col-span-1">
        <el-image :src="productItem.picture"></el-image>
      </li>
      <li class="col-span-3">
        {{ productItem.name }}
      </li>
      <li class="col-span-5">
        {{ productItem.info }}
      </li>
      <li class="col-span-1">
        {{ productItem.price / 100 }}
      </li>
      <li class="col-span-1">
        {{ productItem.count }}
      </li>
      <li class="col-span-1 text-red-500">
        {{ (productItem.count * productItem.price) / 100 }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
