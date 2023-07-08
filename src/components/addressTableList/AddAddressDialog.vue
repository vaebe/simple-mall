<script lang="ts" setup>
import { reactive, defineAsyncComponent } from 'vue';
import type {
  AddressInfo,
  AreaInfo
} from '@/api/backstage/dataManagement/address';
import { saveAddressInfo } from '@/api/backstage/dataManagement/address';
import { usePageListDialog } from '@/composables/usePageList.ts';
import type { FormRules } from 'element-plus';
import { useUserStore } from '@/store';
import { concatenateAddressParts } from '@/utils/tool';
import { validatePhoneNumber } from '@/utils/validateForm';

const AreaSelection = defineAsyncComponent(() => import('./AreaSelection.vue'));

const emit = defineEmits(['refresh-data']);

const dialogForm = reactive<AddressInfo>({
  id: 0,
  city: 0,
  cityName: '',
  defaultAddress: '',
  detailedAddress: '',
  district: 0,
  districtName: '',
  name: '',
  phone: '',
  province: 0,
  provinceName: '',
  street: 0,
  streetName: '',
  userId: 0,
  zipCode: '',
  provinceCityDistrictName: ''
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhoneNumber, trigger: 'blur' }],
  provinceCityDistrictName: [
    {
      required: true,
      message: '地址不能为空！',
      trigger: 'blur'
    }
  ],
  detailedAddress: [
    { required: true, message: '详细地址不能为空!', trigger: 'blur' }
  ]
});

const userStore = useUserStore();

const {
  dialogTitle,
  dialogIsView,
  openDialog,
  dialogVisible,
  dialogFormRef,
  save
} = usePageListDialog({
  openDialogFunc: (data) => {
    dialogForm.userId = userStore.userInfo.id;

    // 数据存在格式化赋值地址信息
    if (data) {
      dialogForm.provinceCityDistrictName = concatenateAddressParts(
        data as AddressInfo
      );
    }
  },
  saveForm: dialogForm,
  saveApi: saveAddressInfo,
  updateApi: saveAddressInfo,

  saveSuccessFunc: () => {
    emit('refresh-data');
  }
});

// 选择地址发生变化
const areaSelectionChange = (list: AreaInfo[], text: string) => {
  // 数组结构赋值
  const [province, city, district, street] = list;

  dialogForm.provinceCityDistrictName = text;
  dialogForm.province = province?.id;
  dialogForm.provinceName = province?.extName;
  dialogForm.city = city?.id;
  dialogForm.cityName = city?.extName;
  dialogForm.district = district?.id;
  dialogForm.districtName = district?.extName;
  dialogForm.street = street?.id;
  dialogForm.streetName = street?.extName;
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px">
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      :rules="rules"
      label-position="top"
      :disabled="dialogIsView"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="dialogForm.name"
          placeholder="请输入姓名"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="dialogForm.phone"
          placeholder="请输入手机号"
          maxlength="11"
        ></el-input>
      </el-form-item>

      <el-form-item label="地址" prop="provinceCityDistrictName">
        <area-selection @change="areaSelectionChange">
          <el-input
            v-model="dialogForm.provinceCityDistrictName"
            placeholder="请选择地址"
            readonly
          ></el-input>
        </area-selection>
      </el-form-item>

      <el-form-item label="详细地址" prop="detailedAddress">
        <el-input
          v-model="dialogForm.detailedAddress"
          :autosize="{ minRows: 2 }"
          type="textarea"
          placeholder="请输入详细地址"
        />
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="邮政编码">
            <el-input v-model="dialogForm.zipCode" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认地址">
            <el-switch
              v-model="dialogForm.defaultAddress"
              inline-prompt
              active-text="是"
              inactive-text="否"
              active-value="01"
              inactive-value="00"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="flex justify-center">
        <el-button v-if="!dialogIsView" type="primary" @click="save">
          保存
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
