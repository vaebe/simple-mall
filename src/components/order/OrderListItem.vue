<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import type { PropType } from 'vue';
import {
  removeOrderInfo,
  orderRefund
} from '@/api/backstage/dataManagement/order';
import type { OrderInfo } from '@/api/backstage/dataManagement/order';
import { getCodeNameByCodeId } from '@/utils/tool';
import { useRouter } from 'vue-router';
import { EnumInfo } from '@/api/backstage/systemManagement/dictionary.ts';

const OrderDetails = defineAsyncComponent(() => import('./OrderDetails.vue'));

const props = defineProps({
  itemData: {
    type: Object as PropType<OrderInfo>,
    default: () => {
      return {};
    }
  },
  refreshData: {
    type: Function,
    default: () => {}
  },
  orderStatusEnums: {
    type: Array as PropType<EnumInfo[]>,
    default: () => {
      return [];
    }
  }
});

// 查看详情
const orderDetailsRef = ref();
const viewOrderDetails = (row: OrderInfo) => {
  orderDetailsRef.value.openDialog(row.id);
};

const router = useRouter();
// 订单支付
const orderPay = (row: OrderInfo) => {
  router.push(`/mall/orderPay/${row.id}`);
};

// 删除订单
const del = (row: OrderInfo) => {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await removeOrderInfo({ id: row.id });
    if (res?.code === 0) {
      ElMessage.success('删除成功');
      props.refreshData && props.refreshData();
    }
  });
};

const refund = (row: OrderInfo) => {
  ElMessageBox.confirm('确认发起退款吗, 是否继续?', '退款', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await orderRefund({
      orderId: row.id + '',
      info: row.products.map((item) => item.info).join('\r\n'),
      price: row.totalPrice / 100 + ''
    });

    if (res?.code === 0) {
      ElMessage.success('正在退款中..');
      props.refreshData && props.refreshData();
    }
  });
};
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
          <span class="text-red-500">{{ itemData.totalPrice / 100 }}</span>
        </p>
      </div>

      <div>
        <el-button link size="small" @click="viewOrderDetails(itemData)">
          查看
        </el-button>
        <!-- 待支付状态才可以支付 -->
        <el-button
          v-if="itemData.state === '00'"
          type="primary"
          link
          size="small"
          @click="orderPay(itemData)"
        >
          支付
        </el-button>
        <!-- 已支付可以退款 -->
        <el-button
          v-if="itemData.state === '01'"
          type="primary"
          link
          size="small"
          @click="refund(itemData)"
        >
          退款
        </el-button>
        <el-button type="danger" link size="small" @click="del(itemData)">
          删除
        </el-button>
      </div>
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

    <!-- 订单详情 -->
    <order-details ref="orderDetailsRef"></order-details>
  </div>
</template>

<style scoped lang="scss"></style>
