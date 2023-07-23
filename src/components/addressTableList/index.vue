<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { concatenateAddressParts, getCodeNameByCodeId } from '@/utils/tool';
import {
  removeAddressInfo,
  setDefaultAddress
} from '@/api/backstage/dataManagement/address';
import type { AddressInfo } from '@/api/backstage/dataManagement/address';
import { getEnumsByType } from '@/api/backstage/systemManagement/dictionary';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';

const AddAddressDialog = defineAsyncComponent(
  () => import('./AddAddressDialog.vue')
);

const props = defineProps({
  tableData: {
    type: Array,
    default: () => {
      return [];
    }
  },
  showAddBut: {
    type: Boolean,
    default: true
  },
  showEditBut: {
    type: Boolean,
    default: true
  },
  showDelBut: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['remove', 'refresh-data']);

const defaultAddressEnums = ref<EnumInfo[]>([]);
const getDefaultAddressEnums = () => {
  getEnumsByType({ type: 'defaultAddress' }).then((res) => {
    defaultAddressEnums.value = res.data || [];
  });
};
getDefaultAddressEnums();

const removeRow = (row: AddressInfo) => {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await removeAddressInfo({ id: row.id });
    if (res?.code === 0) {
      ElMessage.success('删除成功');
      emit('refresh-data');
    }
  });
};

// 是否显示设置默认地址按钮
const showSetDefaultAddressBut = (row: AddressInfo) => {
  return props.showEditBut && row.defaultAddress !== '01';
};

const setDefaultAddressInfo = (row: AddressInfo) => {
  setDefaultAddress({ id: row.id }).then(() => {
    emit('refresh-data');
  });
};

const addAddressDialogRef = ref();
const openAddAddressDialog = (type: string, row?: any) => {
  addAddressDialogRef.value.openDialog(type, row);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="text-title">{{ $route.meta.title }}</span>
      <el-button v-if="showAddBut" @click="openAddAddressDialog('add')">
        新增
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%" class="my-2">
      <el-table-column type="index" label="序号" width="90"></el-table-column>
      <el-table-column label="姓名" prop="name" width="120"></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        width="140"
      ></el-table-column>
      <el-table-column label="地址" width="260">
        <template #default="scope">
          {{ concatenateAddressParts(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="详细地址"
        prop="detailedAddress"
        width="400"
      ></el-table-column>
      <el-table-column
        label="邮政编号"
        prop="zipCode"
        width="100"
      ></el-table-column>
      <el-table-column label="默认地址" prop="defaultAddress" width="90">
        <template #default="scope">
          {{
            getCodeNameByCodeId(scope.row.defaultAddress, defaultAddressEnums)
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openAddAddressDialog('view', scope.row)"
          >
            查看
          </el-button>
          <el-button
            v-if="showEditBut"
            type="warning"
            link
            @click="openAddAddressDialog('edit', scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="showSetDefaultAddressBut(scope.row)"
            type="success"
            link
            @click="setDefaultAddressInfo(scope.row)"
          >
            默认地址
          </el-button>

          <el-button
            v-if="showDelBut"
            type="danger"
            link
            @click="removeRow(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加地址 -->
    <add-address-dialog
      ref="addAddressDialogRef"
      @refresh-data="$emit('refresh-data')"
    ></add-address-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
