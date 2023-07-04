<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { DeleteFilled } from '@element-plus/icons-vue';
import {
  getShoppingCartInfo,
  removeCartItem,
  batchUpdateShoppingCartProductInfo
} from '@/api/mall/shoppingCart';
import type { ShoppingCartInfo } from '@/api/mall/shoppingCart';
import { formatPicturesInfo } from '@/utils/tool';

const SelectedIcon = defineAsyncComponent(
  () => import('./components/SelectedIcon.vue')
);

// 计算商品总金额
const getTheTotalAmountOfTheProduct = (data: ShoppingCartInfo) => {
  return (data.productInfo.price * data.count) / 100;
};

// 选中数据
const selectedList = computed(() =>
  tableData.value.filter((item) => item.selected)
);

// 选中数据总计
const selectedDataTotal = computed(() => selectedList.value.length);

// 总金额
const total = computed(() => {
  return selectedList.value.reduce((accumulator, currentValue) => {
    const product = getTheTotalAmountOfTheProduct(currentValue);
    return accumulator + product;
  }, 0);
});

const tableData = ref<ShoppingCartInfo[]>([]);

// 商品全部选中
const productsAllSelected = ref(false);
// 获取全选状态
const getProductsAllSelectedStatus = () => {
  productsAllSelected.value =
    tableData.value.length === selectedDataTotal.value;
};

const getTableData = () => {
  getShoppingCartInfo().then((res) => {
    tableData.value = res.data || [];
    getProductsAllSelectedStatus();
  });
};
getTableData();

// 切换商品全部选中状态
const toggleProductsAllSelected = () => {
  const list = tableData.value.map((item) => {
    item.selected = productsAllSelected.value;
    return item;
  });

  batchUpdateShoppingCartProductInfo(list).then(() => {
    tableData.value = list;
  });
};

// 更新商品选中状态
const updateItemSelectedStatus = (row: ShoppingCartInfo) => {
  batchUpdateShoppingCartProductInfo([row]).then(() => {
    getProductsAllSelectedStatus();
  });
};

// 删除购物车商品信息
const removeProduct = (row: ShoppingCartInfo) => {
  ElMessageBox.confirm('数据删除后不可恢复！', '确定要删除吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  })
    .then(() => {
      removeCartItem({ productId: row.productId }).then(() => {
        getTableData();
        ElMessage.success('删除商品成功！');
      });
    })
    .catch(() => {
      ElMessage.info('取消删除！');
    });
};
</script>

<template>
  <div class="w-full min-[1280px] flex flex-col items-center">
    <div class="w-full xl:w-10/12 mt-4">
      <h1 class="mb-4 cursor-pointer">购物车</h1>
      <el-table :data="tableData" style="width: 100%; min-height: 80vh">
        <el-table-column prop="sel" label="选中" width="80">
          <template #header>
            <selected-icon
              v-model="productsAllSelected"
              @change="toggleProductsAllSelected"
            ></selected-icon>
          </template>
          <template #default="scope">
            <selected-icon
              v-model="scope.row.selected"
              @change="updateItemSelectedStatus(scope.row)"
            ></selected-icon>
          </template>
        </el-table-column>
        <el-table-column prop="productInfo.pictures" label="全选" width="100">
          <template #default="scope">
            <el-image
              :src="formatPicturesInfo(scope.row.productInfo.pictures).url"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="productInfo.info"
          label="商品信息"
          min-width="200"
        />
        <el-table-column prop="productInfo.price" label="单价" width="120">
          <template #default="scope">
            {{ scope.row.productInfo.price / 100 }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="数量" width="180">
          <template #default="scope">
            <el-input-number
              v-model="tableData[scope.$index].count"
              :min="1"
              @change="batchUpdateShoppingCartProductInfo(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="金额" width="140">
          <template #default="scope">
            {{ getTheTotalAmountOfTheProduct(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="80">
          <template #default="scope">
            <p class="text-red-500">
              <el-icon size="20" @click="removeProduct(scope.row)">
                <DeleteFilled />
              </el-icon>
            </p>
          </template>
        </el-table-column>
      </el-table>

      <div
        class="sticky bottom-0 z-10 p-4 flex items-center justify-between rounded bg-slate-200 dark:bg-stone-950"
      >
        <div class="flex items-center">
          <selected-icon
            v-model="productsAllSelected"
            @change="toggleProductsAllSelected"
          ></selected-icon>
          <p class="font-medium">
            <span class="mx-4">全选</span>
            <span>已选 {{ selectedDataTotal }} 件</span>
          </p>
        </div>

        <div class="flex items-center">
          <p class="font-medium">
            <span>合计:</span>
            <span class="text-red-500 mx-4">￥{{ total }}</span>
          </p>

          <div
            class="ml-4 px-8 py-2 cursor-pointer rounded text-white bg-red-500 hover:bg-red-400"
          >
            去结算
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
